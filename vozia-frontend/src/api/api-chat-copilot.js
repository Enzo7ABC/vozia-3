export async function POST_API_CHAT_COPILOT(req) {
  try {
    const body = await req.json();
    const { message } = body;

    // Conexión directa al endpoint de FastAPI
    const fastapiResponse = await fetch("http://127.0.0.1:8000/copilot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        session_id: "default-session" 
      }),
    });

    if (!fastapiResponse.ok) {
      throw new Error(`FastAPI error: ${fastapiResponse.status}`);
    }

    const data = await fastapiResponse.json();

    return Response.json({
      success: true,
      data: {
        reply: data.response,
      },
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || "Internal API error",
      },
      { status: 500 }
    );
  }
}