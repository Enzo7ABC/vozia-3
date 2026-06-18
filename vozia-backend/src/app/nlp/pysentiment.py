from pysentimiento import create_analyzer


# ============================================================
# MODELOS (se cargan una sola vez en memoria)
# ============================================================
_sentiment_analyzer = create_analyzer(task="sentiment", lang="es")
_emotion_analyzer = create_analyzer(task="emotion", lang="es")


# ============================================================
# CORE NLP FUNCTION
# ============================================================
def nlp_engine(text: str) -> dict:
    """
    Analiza sentimiento y emoción de un texto en español.

    Returns:
        dict:
            sentiment: POS | NEG | NEU
            emotion: sadness | anger | joy | fear | surprise | others
    """
    if not text or not isinstance(text, str):
        return {
            "text": "",
            "sentiment": "NEU",
            "emotion": "others"
        }

    text = text.strip()

    sentiment_result = _sentiment_analyzer.predict(text)
    emotion_result = _emotion_analyzer.predict(text)

    return {
        "text": text,
        "sentiment": sentiment_result.output,
        "emotion": emotion_result.output
    }

# ============================================================
# CLI TEST MODE
# ============================================================
if __name__ == "__main__":
    print("Pysentimiento NLP - CLI Test Mode")
    print("Escribe 'exit' para salir\n")

    while True:
        text = input("Texto > ")

        if text.lower() in ["exit", "quit", "salir"]:
            break

        result = nlp_engine(text)

        print("\n📊 RESULTADO:")
        print(f"Sentimiento: {result['sentiment']}")
        print(f"Emoción:     {result['emotion']}")
        print("-" * 40)