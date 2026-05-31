import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const [form, setForm] = useState({
    name: "", quantity: 0, category: "", minStock: 1,
    expiryDate: "", lastPurchasedDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const changeQty = (delta) => set("quantity", Math.max(0, (form.quantity || 0) + delta));
  const changeMin = (delta) => set("minStock", Math.max(0, (form.minStock || 0) + delta));

  const submit = async () => {
    if (!form.name || !form.category) return setError("Item name aur category required hai");
    try {
      setError(""); setLoading(true);
      await API.post("/items", {
        ...form,
        expiryDate: form.expiryDate || null,
        lastPurchasedDate: form.lastPurchasedDate || null,
      });
      nav("/inventory");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => nav("/inventory")}
            className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-gray-300 mb-3 transition"
          >
            ← <span className="font-bold">Inventory</span>
          </button>
          <h1 className="text-2xl font-light text-white tracking-tight">
            Add <span className="font-medium">item</span>
          </h1>
          <p className="text-xs text-gray-600 mt-1">New inventory entry</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-800/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 mb-2.5">
          <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest flex items-center gap-2">
            Basic info <span className="flex-1 border-t border-gray-800" />
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Item name</label>
            <input
              type="text" value={form.name} maxLength={50}
              placeholder="e.g. Soft Drink"
              onChange={(e) => set("name", e.target.value)}
              className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 transition"
            />
            <p className="text-[10px] text-gray-600 text-right font-mono">{form.name.length} / 50</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Quantity</label>
              <div className="flex">
                <button onClick={() => changeQty(-1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">−</button>
                <input type="number" value={form.quantity} min={0}
                  onChange={(e) => set("quantity", parseInt(e.target.value) || 0)}
                  className="flex-1 h-9 text-center bg-gray-800 border-y border-gray-700 text-sm text-white font-mono outline-none" />
                <button onClick={() => changeQty(1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-r-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">+</button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Min stock</label>
              <div className="flex">
                <button onClick={() => changeMin(-1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">−</button>
                <input type="number" value={form.minStock} min={0}
                  onChange={(e) => set("minStock", parseInt(e.target.value) || 0)}
                  className="flex-1 h-9 text-center bg-gray-800 border-y border-gray-700 text-sm text-white font-mono outline-none" />
                <button onClick={() => changeMin(1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-r-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">+</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Category</label>
            <input
              type="text" value={form.category}
              placeholder="e.g. Beverages"
              onChange={(e) => set("category", e.target.value)}
              className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 transition"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 mb-3">
          <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest flex items-center gap-2">
            Dates
            <span className="text-[9px] normal-case text-gray-700 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full tracking-normal">optional</span>
            <span className="flex-1 border-t border-gray-800" />
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Expiry date</label>
              <input type="date" value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
                className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono outline-none focus:border-gray-500 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Last purchased</label>
              <input type="date" value={form.lastPurchasedDate}
                onChange={(e) => set("lastPurchasedDate", e.target.value)}
                className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono outline-none focus:border-gray-500 transition" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => nav("/inventory")}
            className="h-10 px-5 text-sm text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 transition">
            Cancel
          </button>
          <button onClick={submit} disabled={loading}
            className="flex-1 h-10 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-40 transition">
            {loading ? "Adding..." : "Add item →"}
          </button>
        </div>
      </div>
    </div>
  );
}