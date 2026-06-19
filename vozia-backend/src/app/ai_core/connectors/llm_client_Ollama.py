import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_core.callbacks import BaseCallbackHandler

load_dotenv()


class LLMMonitorCallback(BaseCallbackHandler):

    def on_llm_start(self, serialized, prompts, **kwargs):
        print("🟡 LLM START")

    def on_llm_end(self, response, **kwargs):
        print("🟢 LLM END")

    def on_llm_error(self, error, **kwargs):
        print("🔴 LLM ERROR:", error)


# ============================================================
# FLAG DE PRODUCCIÓN
# ============================================================

USE_LLM = os.getenv("USE_LLM", "false") == "true"


# ============================================================
# SINGLETON (CONDICIONAL)
# ============================================================

_llm_instance = None

if USE_LLM:
    _llm_instance = ChatOllama(
        model=os.getenv("OLLAMA_MODEL", "llama3"),
        format="json",
        temperature=0,
        callbacks=[LLMMonitorCallback()]
    )


# ============================================================
# ACCESSOR
# ============================================================

def get_ollama_llm():
    """
    Devuelve LLM si está activo, si no lanza error controlado.
    """
    if not USE_LLM:
        raise RuntimeError("LLM desactivado en producción (USE_LLM=false)")
    
    return _llm_instance