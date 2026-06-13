# ollama_adapter.py
from dotenv import load_dotenv
from langchain_ollama import ChatOllama

import os

load_dotenv()

_llm_instance = ChatOllama(
    model=os.getenv("OLLAMA_MODEL"),
    format="json",
    temperature=0
)

def get_ollama_llm():
    """
    Devuelve la instancia única del modelo.
    No ejecuta invoke, solo entrega el motor.
    """
    return _llm_instance