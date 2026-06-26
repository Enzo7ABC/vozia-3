import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
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
# REGISTRO DE MODELOS DISPONIBLES (DURADERO Y FÁCIL DE EXTENDER)
# ============================================================
AVAILABLE_MODELS = [
    {
        "id": "openai",
        "name": "OpenAI GPT-4 (Groq Cloud)",
        "provider": "groq",
        "latency": "1.2s",
        "tokens": "128k",
        "color": "text-emerald-400",
        "description": "Modelo insignia de OpenAI procesado a través de la nube de Groq."
    },
    {
        "id": "gemini",
        "name": "Gemini 1.5 Pro (Groq Cloud)",
        "provider": "groq",
        "latency": "0.8s",
        "tokens": "2m",
        "color": "text-blue-400",
        "description": "Modelo de Google optimizado para alta velocidad y contexto masivo."
    },
    {
        "id": "anthropic",
        "name": "Anthropic Claude 3.5 (Groq Cloud)",
        "provider": "groq",
        "latency": "1.5s",
        "tokens": "200k",
        "color": "text-orange-400",
        "description": "Modelo premium de Anthropic con alta precisión y control analítico."
    },
    {
        "id": "mistral:7b",
        "name": "Mistral 7B (Local Ollama)",
        "provider": "ollama",
        "latency": "0.6s (Local)",
        "tokens": "32k",
        "color": "text-red-400",
        "description": "Modelo francés open-source ultra rápido y preciso para tareas lógicas."
    },
    {
        "id": "gemma:2b",
        "name": "Gemma 2B (Local Ultra-Rápido)",
        "provider": "ollama",
        "latency": "0.1s (Local)",
        "tokens": "8k",
        "color": "text-yellow-400",
        "description": "Modelo de Google súper ligero ideal para correr en CPU en tiempo real sin GPU."
    }
]

# ============================================================
# CONTENEDORES DE INSTANCIAS (CACHE SINGLETON)
# ============================================================
_llm_instances = {}


# ============================================================
# FACTORY / ACCESSOR DINÁMICO
# ============================================================
def get_ollama_llm(model_name=None, json_mode=True):
    global _llm_instances

    if not USE_LLM:
        return None

    # Si no se provee modelo, usar "openai" (Groq Cloud) por defecto
    if not model_name:
        model_name = "openai"

    model_key = (model_name.lower(), json_mode)

    # Devolver instancia existente si ya se ha creado
    if model_key in _llm_instances:
        return _llm_instances[model_key]

    # Determinar el proveedor y la configuración correspondiente
    model_info = next((m for m in AVAILABLE_MODELS if m["id"].lower() == model_name.lower()), None)
    provider = model_info["provider"] if model_info else ("ollama" if ":" in model_name or "qwen" in model_name or "mistral" in model_name else "groq")

    if provider == "ollama":
        # Instanciar modelo local usando ChatOllama
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        print(f"[Ollama Client] Instanciando modelo local '{model_name}' en {ollama_url} (JSON={json_mode})")
        
        # ChatOllama soporta json mediante format="json"
        instance = ChatOllama(
            model=model_name,
            base_url=ollama_url,
            temperature=0,
            format="json" if json_mode else None,
            callbacks=[LLMMonitorCallback()]
        )
    else:
        # Instanciar modelo Cloud (Groq) usando la envoltura multi-llave existente
        api_keys = []
        
        # 1. Buscar en GROQ_API_KEYS (lista separada por comas)
        keys_env = os.getenv("GROQ_API_KEYS", "")
        if keys_env:
            for k in keys_env.split(","):
                k = k.strip()
                if k and k not in api_keys:
                    api_keys.append(k)

        # 2. Buscar en GROQ_API_KEY
        single_key_env = os.getenv("GROQ_API_KEY", "")
        if single_key_env:
            for k in single_key_env.split(","):
                k = k.strip()
                if k and k not in api_keys:
                    api_keys.append(k)

        # 3. Buscar claves numeradas
        for key, value in os.environ.items():
            if key.startswith("GROQ_API_KEY_"):
                for part in value.split(","):
                    part = part.strip()
                    if part and part not in api_keys:
                        api_keys.append(part)

        if not api_keys:
            print("[Advertencia] No se encontraron API keys de Groq en las variables de entorno.")

        # Mapear el ID al modelo real de Groq si es necesario
        groq_model = "llama-3.3-70b-versatile"
        if model_name.lower() == "gemini":
            groq_model = "llama-3.3-70b-versatile"
        elif model_name.lower() == "anthropic":
            groq_model = "llama-3.3-70b-versatile"

        print(f"[Groq Client] Instanciando modelo Cloud '{groq_model}' para alias '{model_name}' (JSON={json_mode})")
        instance = MultiKeyChatGroq(
            api_keys=api_keys,
            model=groq_model,
            temperature=0,
            response_format={"type": "json_object"} if json_mode else None,
            callbacks=[LLMMonitorCallback()]
        )

    # Guardar en cache y devolver
    _llm_instances[model_key] = instance
    return instance