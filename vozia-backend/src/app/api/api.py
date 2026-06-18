from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import io
import speech_recognition as sr

from langchain_core.messages import HumanMessage

from src.app.ai_core.graphs.graph_ia_voz import app_agent_call_state
from src.app.ai_core.graphs.graph_copilot import app_copilot

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
                "sentiment": "",  
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
    print(result)

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
# 2.5. TRANSCRIBE AUDIO
# ============================================================

@app_api.post("/ia-voz/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        # Leer el archivo WAV
        audio_bytes = await file.read()
        
        # Cargar el audio con speech_recognition
        recognizer = sr.Recognizer()
        
        # SpeechRecognition requiere un objeto tipo file. Usamos BytesIO.
        audio_file_like = io.BytesIO(audio_bytes)
        
        with sr.AudioFile(audio_file_like) as source:
            audio_data = recognizer.record(source)
            
        # Reconocer el audio usando la API de Google
        try:
            transcript = recognizer.recognize_google(audio_data, language="es-ES")
        except sr.UnknownValueError:
            raise HTTPException(status_code=400, detail="No se pudo entender el audio. ¿Es un audio vacío o con mucho ruido?")
        except sr.RequestError as e:
            raise HTTPException(status_code=520, detail=f"Error en el servicio de Google Speech Recognition: {e}")
            
        return {
            "filename": file.filename,
            "transcript": transcript,
            "status": "success"
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el audio: {str(e)}")


# ============================================================
# 3. HEALTH
# ============================================================

@app_api.get("/health")
def health():
    return {"status": "ok"}