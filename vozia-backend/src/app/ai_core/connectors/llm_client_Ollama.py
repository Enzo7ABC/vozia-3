import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_core.callbacks import BaseCallbackHandler

load_dotenv()


# ============================================================
# CALLBACK (MONITOR)
# ============================================================
class LLMMonitorCallback(BaseCallbackHandler):

    def on_llm_start(self, serialized, prompts, **kwargs):
        print("🟡 LLM START")

    def on_llm_end(self, response, **kwargs):
        print("🟢 LLM END")

    def on_llm_error(self, error, **kwargs):
        print("🔴 LLM ERROR:", error)


# ============================================================
# FLAG
# ============================================================
USE_LLM = os.getenv("USE_LLM", "false").lower() == "true"


# ============================================================
# SINGLETON HOLDER (NO INIT EN IMPORT TIME)
# ============================================================
_llm_instance = None


# ============================================================
# FACTORY / ACCESSOR
# ============================================================
def get_ollama_llm():
    global _llm_instance

    if not USE_LLM:
        return None

    if _llm_instance is None:
        _llm_instance = ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "llama3"),
            format="json",
            temperature=0,
            callbacks=[LLMMonitorCallback()]
        )

    return _llm_instance