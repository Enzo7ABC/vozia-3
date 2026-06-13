# ollama_adapter.py
from langchain_ollama import ChatOllama

# Se crea UNA VEZ al cargar el módulo (Memoria optimizada)
_llm_instance = ChatOllama(
    model="gpt-oss:120b-cloud", 
    format="json", 
    temperature=0
)

def get_ollama_llm():
    """
    Devuelve la instancia única del modelo.
    No ejecuta invoke, solo entrega el motor.
    """
    return _llm_instance