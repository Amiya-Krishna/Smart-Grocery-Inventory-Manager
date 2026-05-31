import { useState } from "react";
import { askAI } from "../services/assistant";

export default function Assistant({ items }) {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");

  const handleAsk = async () => {
    const res = await askAI(q, items);
    setAns(res);
  };

  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <button onClick={handleAsk}>Ask</button>

      <p>{ans}</p>
    </div>
  );
}