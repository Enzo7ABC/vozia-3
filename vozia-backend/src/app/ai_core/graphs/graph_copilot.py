from langgraph.graph import StateGraph, END


# ============================================================
# ROUTER INTELIGENTE
# ============================================================

def detect_domain(analisis: dict, resultado: dict):

    interes = analisis.get("interes", 0)
    angustia = analisis.get("angustia", 0)
    urgencia = analisis.get("urgencia", 0)
    satisfaccion = analisis.get("satisfaccion", 0)

    palabras = resultado.get("palabras_clave", [])

    if "baja" in palabras or urgencia >= 80:
        return "RETENCION"

    if angustia >= 70 and satisfaccion <= 30:
        return "CONTENCION"

    if interes >= 70:
        return "COMERCIAL"

    return "OPERATIVO"


# ============================================================
# SUB-AGENTES
# ============================================================

def agente_retencion(_):

    return {
        "situacion": "RIESGO_BAJA",
        "instruccion": "retener cliente",
        "guia_agente": {
            "que_hacer": "Priorizar retención antes de procesar baja",
            "que_decir": "Entiendo tu decisión, quiero ayudarte antes de cancelar",
            "que_evitar": "Aceptar baja sin explorar motivos"
        }
    }


def agente_contencion(_):

    return {
        "situacion": "ALTA_TENSION",
        "instruccion": "contención emocional",
        "guia_agente": {
            "que_hacer": "Bajar tensión emocional antes de avanzar",
            "que_decir": "Entiendo cómo te sentís, estoy para ayudarte",
            "que_evitar": "Lenguaje técnico o demoras"
        }
    }


def agente_comercial(_):

    return {
        "situacion": "OPORTUNIDAD_COMERCIAL",
        "instruccion": "explorar venta",
        "guia_agente": {
            "que_hacer": "Validar emoción antes de ofrecer",
            "que_decir": "Tengo una opción que puede mejorar tu experiencia",
            "que_evitar": "Venta agresiva"
        }
    }


def agente_operativo(_):

    return {
        "situacion": "NORMAL",
        "instruccion": "resolver caso",
        "guia_agente": {
            "que_hacer": "Resolver problema técnico",
            "que_decir": "Perfecto, te ayudo con eso",
            "que_evitar": "Nada crítico"
        }
    }


# ============================================================
# COPILOT NODE
# ============================================================

def copilot_node(state: dict) -> dict:

    call_state = state["call_state"]
    analisis = call_state.get("analisis", {})
    resultado = call_state.get("resultado", {})

    domain = detect_domain(analisis, resultado)

    if domain == "RETENCION":
        output = agente_retencion(call_state)

    elif domain == "CONTENCION":
        output = agente_contencion(call_state)

    elif domain == "COMERCIAL":
        output = agente_comercial(call_state)

    else:
        output = agente_operativo(call_state)

    call_state["copilot"] = {
        "dominio": domain,
        **output
    }

    return {
        "call_state": call_state,
        "messages": state.get("messages", [])
    }


# ============================================================
# GRAPH
# ============================================================

def build_copilot_graph():

    workflow = StateGraph(dict)

    workflow.add_node("copilot", copilot_node)

    workflow.set_entry_point("copilot")

    workflow.add_edge("copilot", END)

    return workflow.compile()


app_copilot = build_copilot_graph()