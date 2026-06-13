from src.app.ai_core.graphs.graph_copilot import app_copilot
from langchain_core.messages import HumanMessage


def run():

    print("\n Módulo COPILOT CLI\n")

    state = {
        "messages": [],
        "call_state": {
            "analisis": {
                "interes": 0,
                "angustia": 0,
                "urgencia": 0,
                "satisfaccion": 100
            },
            "resultado": {
                "palabras_clave": []
            }
        }
    }

    session_id = "cli-session"

    while True:

        user_input = input("👤 Usuario > ")

        if user_input.lower() in ["exit", "salir"]:
            break

        state["messages"].append(
            HumanMessage(content=user_input)
        )

        result = app_copilot.invoke(
            state,
            config={
                "configurable": {
                    "thread_id": session_id
                }
            }
        )

        print("\n🤖 Copilot >")
        print(result["call_state"]["copilot"])
        print()

        state = result


run()