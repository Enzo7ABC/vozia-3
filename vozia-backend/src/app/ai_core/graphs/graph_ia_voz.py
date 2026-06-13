import json

from typing import TypedDict, List, Dict, Any

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from langchain_core.messages import (
    HumanMessage,
    AIMessage,
    SystemMessage,
    BaseMessage,
)

from app.ai_core.connectors.llm_client_Ollama import get_ollama_llm
# ============================================================
# LLM
# ============================================================

llm = get_ollama_llm()
memory = MemorySaver()


# ============================================================
# STATE
# ============================================================

class IaVozState(TypedDict):
    messages: List[BaseMessage]
    call_state: Dict[str, Any]


# ============================================================
# SYSTEM PROMPT
# ============================================================

def build_system_prompt():

    return """
Eres VozIA.

Eres un motor de análisis emocional para llamadas de Call Center.

Tu trabajo NO es conversar.
Tu trabajo es completar el estado vivo de una llamada.

Recibes:

1. La transcripción del cliente.
2. El estado actual de la llamada.

Debes devolver EXCLUSIVAMENTE el objeto:

{
  "analisis": {
    "emocion_principal": "",
    "interes": 0,
    "angustia": 0,
    "urgencia": 0,
    "satisfaccion": 0
  },

  "resultado": {
    "resumen": "",
    "palabras_clave": []
  },

  "accion": {
    "recomendada": ""
  }
}

REGLAS:

- Solo JSON válido.
- No markdown.
- No explicar.
- No agregar texto fuera del JSON.
- interes, angustia, urgencia y satisfaccion deben estar entre 0 y 100.
- palabras_clave debe ser una lista.
- resumen máximo 40 palabras.
- accion.recomendada máximo 15 palabras.
"""


# ============================================================
# NODE
# ============================================================

def analysis_node(state: IaVozState):

    call_state = state["call_state"]
    messages = state["messages"]

    transcript = (
        call_state
        .get("audio_original", {})
        .get("content", "")
    )

    prompt = [

        SystemMessage(
            content=build_system_prompt()
        ),

        SystemMessage(
            content=(
                "CALL_STATE:\n"
                + json.dumps(
                    call_state,
                    ensure_ascii=False,
                    indent=2
                )
            )
        ),

        HumanMessage(
            content=transcript
        )
    ]

    response = llm.invoke(prompt)

    raw = response.content.strip()

    if raw.startswith("```json"):
        raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(raw)

    except Exception:

        parsed = {
            "analisis": {
                "emocion_principal": "indeterminado",
                "interes": 0,
                "angustia": 0,
                "urgencia": 0,
                "satisfaccion": 0
            },
            "resultado": {
                "resumen": "No fue posible procesar el análisis.",
                "palabras_clave": []
            },
            "accion": {
                "recomendada": "Revisar transcripción."
            }
        }

    call_state["estado"]["step"] = "resultados"
    call_state["estado"]["processing"] = False

    call_state["analisis"] = parsed.get(
        "analisis",
        call_state["analisis"]
    )

    call_state["resultado"] = parsed.get(
        "resultado",
        call_state["resultado"]
    )

    call_state["accion"] = parsed.get(
        "accion",
        call_state["accion"]
    )

    return {
        "messages": messages + [
            AIMessage(
                content=json.dumps(
                    call_state,
                    ensure_ascii=False
                )
            )
        ],
        "call_state": call_state
    }


# ============================================================
# GRAPH
# ============================================================

workflow = StateGraph(IaVozState)

workflow.add_node(
    "analysis",
    analysis_node
)

workflow.set_entry_point(
    "analysis"
)

workflow.add_edge(
    "analysis",
    END
)

app_agent_call_state = workflow.compile(
    checkpointer=memory
)