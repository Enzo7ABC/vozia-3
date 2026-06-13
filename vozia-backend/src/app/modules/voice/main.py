import json

from langchain_core.messages import HumanMessage

from src.app.ai_core.graphs.graph_ia_voz import app_agent_call_state


def run():

    print("\n Módulo VOICE CLI\n")

    session_id = "voice-cli-session"

    while True:

        transcript = input("🎤 Transcripción > ")

        if transcript.lower() in ["exit", "salir"]:
            break

        state = {
            "messages": [
                HumanMessage(content=transcript)
            ],
            "call_state": {

                "audio_original": {
                    "content": transcript
                },

                "estado": {
                    "step": "analysis",
                    "processing": True
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

        result = app_agent_call_state.invoke(
            state,
            config={
                "configurable": {
                    "thread_id": session_id
                }
            }
        )

        print("\n📊 Resultado\n")

        print(
            json.dumps(
                result["call_state"],
                ensure_ascii=False,
                indent=2
            )
        )

        print()


if __name__ == "__main__":
    run()