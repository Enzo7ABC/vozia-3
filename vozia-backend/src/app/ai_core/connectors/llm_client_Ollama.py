import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.callbacks import BaseCallbackHandler

load_dotenv()


# ============================================================
# CALLBACK (MONITOR)
# ============================================================
class LLMMonitorCallback(BaseCallbackHandler):

    def on_llm_start(self, serialized, prompts, **kwargs):
        print("[LLM START]")

    def on_llm_end(self, response, **kwargs):
        print("[LLM END]")

    def on_llm_error(self, error, **kwargs):
        print("[LLM ERROR]:", error)


# ============================================================
# FLAG
# ============================================================
USE_LLM = os.getenv("USE_LLM", "true").lower() == "true"


# ============================================================
# MULTI-KEY WRAPPER FOR RETRY AND ROTATION
# ============================================================
class MultiKeyChatGroq:
    def __init__(self, api_keys, **kwargs):
        self.api_keys = api_keys
        self.kwargs = kwargs
        self.current_key_idx = 0

    def invoke(self, messages, **kwargs):
        if not self.api_keys:
            raise ValueError("No se configuró ninguna GROQ_API_KEY en el entorno.")

        last_exception = None

        for attempt in range(len(self.api_keys)):
            current_key = self.api_keys[self.current_key_idx]
            masked_key = f"...{current_key[-6:]}" if len(current_key) > 6 else "oculta"
            print(f"[Groq Multi-Key] Intentando invoke con API Key index {self.current_key_idx} ({masked_key})")
            
            try:
                llm = ChatGroq(
                    groq_api_key=current_key,
                    **self.kwargs
                )
                response = llm.invoke(messages, **kwargs)
                return response
            except Exception as e:
                print(f"[Groq Multi-Key] Error usando API Key index {self.current_key_idx}: {e}")
                last_exception = e
                self.current_key_idx = (self.current_key_idx + 1) % len(self.api_keys)

        print("[Groq Multi-Key] Todas las API Keys fallaron.")
        raise last_exception

    async def ainvoke(self, messages, **kwargs):
        if not self.api_keys:
            raise ValueError("No se configuró ninguna GROQ_API_KEY en el entorno.")

        last_exception = None
        for attempt in range(len(self.api_keys)):
            current_key = self.api_keys[self.current_key_idx]
            masked_key = f"...{current_key[-6:]}" if len(current_key) > 6 else "oculta"
            print(f"[Groq Multi-Key] Intentando ainvoke con API Key index {self.current_key_idx} ({masked_key})")
            
            try:
                llm = ChatGroq(
                    groq_api_key=current_key,
                    **self.kwargs
                )
                response = await llm.ainvoke(messages, **kwargs)
                return response
            except Exception as e:
                print(f"[Groq Multi-Key] Error async usando API Key index {self.current_key_idx}: {e}")
                last_exception = e
                self.current_key_idx = (self.current_key_idx + 1) % len(self.api_keys)

        print("[Groq Multi-Key] Todas las API Keys fallaron en modo async.")
        raise last_exception


# ============================================================
# SINGLETON HOLDERS (NO INIT EN IMPORT TIME)
# ============================================================
_llm_json_instance = None
_llm_text_instance = None


# ============================================================
# FACTORY / ACCESSOR
# ============================================================
def get_ollama_llm(json_mode=True):
    global _llm_json_instance, _llm_text_instance

    if not USE_LLM:
        return None

    # Obtenemos las llaves una sola vez si es necesario
    if (json_mode and _llm_json_instance is None) or (not json_mode and _llm_text_instance is None):
        api_keys = []
        
        # 1. Buscar en GROQ_API_KEYS (lista separada por comas)
        keys_env = os.getenv("GROQ_API_KEYS", "")
        if keys_env:
            for k in keys_env.split(","):
                k = k.strip()
                if k and k not in api_keys:
                    api_keys.append(k)

        # 2. Buscar en GROQ_API_KEY (puede ser una sola o separada por comas)
        single_key_env = os.getenv("GROQ_API_KEY", "")
        if single_key_env:
            for k in single_key_env.split(","):
                k = k.strip()
                if k and k not in api_keys:
                    api_keys.append(k)

        # 3. Buscar claves numeradas (GROQ_API_KEY_1, GROQ_API_KEY_2, etc.)
        for key, value in os.environ.items():
            if key.startswith("GROQ_API_KEY_"):
                for part in value.split(","):
                    part = part.strip()
                    if part and part not in api_keys:
                        api_keys.append(part)

        if not api_keys:
            print("[Advertencia] No se encontraron API keys de Groq en las variables de entorno.")

        instance = MultiKeyChatGroq(
            api_keys=api_keys,
            model="llama-3.3-70b-versatile",
            temperature=0,
            response_format={"type": "json_object"} if json_mode else None,
            callbacks=[LLMMonitorCallback()]
        )

        if json_mode:
            _llm_json_instance = instance
        else:
            _llm_text_instance = instance

    return _llm_json_instance if json_mode else _llm_text_instance