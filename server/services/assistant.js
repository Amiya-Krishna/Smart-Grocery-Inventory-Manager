import axios from "axios";

export const askAI = async (question, items) => {
  const context = items.map((i) => `${i.name}:${i.quantity}`).join(",");

  const res = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a grocery assistant",
      },
      {
        role: "user",
        content: `Inventory: ${context}. Question: ${question}`,
      },
    ],
  });

  return res.data.choices[0].message.content;
};