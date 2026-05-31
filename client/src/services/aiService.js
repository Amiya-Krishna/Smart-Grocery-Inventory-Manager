const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

// AI integration: calls the FastAPI prediction engine.
export const getPrediction = async (data) => {
  try {
    console.log("Sending data:", data);

    const res = await fetch(`${AI_API_URL}/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("Response status:", res.status);

    const json = await res.json();
    console.log("Response data:", json);

    return json;

  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};