from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from langchain_core.messages import HumanMessage

from app.ai_core.graphs.graph_ia_voz import app_agent_call_state
from app.ai_core.graphs.graph_copilot import app_copilot

app_api = FastAPI()

MEMORY_LIVE_CONTEXT = {}

app_api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    session_id: str = "default-session"


# ============================================================
# 1. API 1 & AGENTE 1 - ANALISIS
# ============================================================

@app_api.post("/ia-voz/call-state")
def call_state(req: ChatRequest):

    config = {
        "configurable": {
            "thread_id": req.session_id
        }
    }

    state = {
        "messages": [HumanMessage(content=req.message)],
        "call_state": {
            "page": "ia_voz",
            "audio_original": {
                "type": "text",
                "content": req.message
            },
            "estado": {
                "step": "resultados",
                "processing": False
            },
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
    }

    result = app_agent_call_state.invoke(state, config=config)

    MEMORY_LIVE_CONTEXT[req.session_id] = result["call_state"]

    return {
        "session_id": req.session_id,
        "call_state": result["call_state"]
    }


# ============================================================
# 2.API 2 & AGENTE 2 - COPILOT
# ============================================================

@app_api.post("/copilot/chat")
def copilot_chat(req: ChatRequest):

    call_state = MEMORY_LIVE_CONTEXT.get(req.session_id)

    if call_state is None:
        return {
            "session_id": req.session_id,
            "response": "No hay llamada activa.",
            "call_state": None
        }

    state = {
        "messages": [HumanMessage(content=req.message)],
        "call_state": call_state
    }

    result = app_copilot.invoke(state)

    updated_state = result["call_state"]

    MEMORY_LIVE_CONTEXT[req.session_id] = updated_state

    return {
        "session_id": req.session_id,
        "response": updated_state["copilot"]["guia_agente"]["que_hacer"],
        "call_state": updated_state
    }


# ============================================================
# 3. HEALTH
# ============================================================

@app_api.get("/health")
def health():
    return {"status": "ok"}