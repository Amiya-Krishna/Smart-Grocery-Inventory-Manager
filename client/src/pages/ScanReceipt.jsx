import { useState } from "react";
import axios from "axios";

export default function ScanReceipt() {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("/api/ai/ocr", formData);
    setItems(res.data.items);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Scan</button>

      {items.map((i, idx) => (
        <p key={idx}>{i}</p>
      ))}
    </div>
  );
}