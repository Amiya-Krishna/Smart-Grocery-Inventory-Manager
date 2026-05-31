import axios from "axios";

export const predictUsage = async (history) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/predict", {
      history,
    });

    return res.data;
  } catch (err) {
    console.error("AI ERROR:", err.message);
    return { result: "AI service failed" };
  }
};