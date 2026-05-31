import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function EditItem() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "", quantity: 0, category: "", minStock: 1,
    expiryDate: "", lastPurchasedDate: "",
  });
  const [changed, setChanged] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const markChanged = (field) =>
    setChanged((prev) => ({ ...prev, [field]: true }));

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    markChanged(field);
  };

  const changeQty = (delta) =>
    set("quantity", Math.max(0, (form.quantity || 0) + delta));
  const changeMin = (delta) =>
    set("minStock", Math.max(0, (form.minStock || 0) + delta));

  const stockStatus = () => {
    if (form.quantity <= 0) return { label: "Out of stock", color: "#E24B4A", pct: 0, cls: "danger" };
    if (form.quantity < form.minStock) return { label: "Low stock", color: "#EF9F27", pct: 25, cls: "warn" };
    return { label: "Healthy stock level", color: "#1D9E75", pct: Math.min(100, (form.quantity / form.minStock) * 50), cls: "" };
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        const item = res.data;
        const fmt = (d) => d ? new Date(d).toISOString().split("T")[0] : "";
        setForm({
          name: item.name || "", quantity: item.quantity || 0,
          category: item.category || "", minStock: item.minStock || 1,
          expiryDate: fmt(item.expiryDate),
          lastPurchasedDate: fmt(item.lastPurchasedDate),
        });
      } catch { setError("Failed to load item"); }
      finally { setLoading(false); }
    };
    fetchItem();
  }, [id]);

  const submit = async () => {
    if (!form.name || !form.category) return setError("Name aur Category required hai");
    try {
      setSaving(true); setError("");
      await API.put(`/items/${id}`, {
        ...form,
        expiryDate: form.expiryDate || null,
        lastPurchasedDate: form.lastPurchasedDate || null,
      });
      nav("/inventory");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
    } finally { setSaving(false); }
  };

  const Dot = ({ field }) =>
    changed[field] ? (
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" />
    ) : null;

  const status = stockStatus();

  if (loading) return (
    <div className="p-8 text-sm text-gray-500 animate-pulse">Loading item...</div>
  );

  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-md">

        {/* Header — ID badge removed */}
        <div className="mb-6">
          <button
            onClick={() => nav("/inventory")}
            className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-gray-300 mb-3 transition"
          >
            ← <span className="font-bold">Inventory</span>
          </button>
          <h1 className="text-2xl font-light text-white tracking-tight">Edit item</h1>
          <p className="text-xs text-gray-600 mt-1">Changes sync after saving</p>
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
            <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              Item name <Dot field="name" />
            </label>
            <input
              type="text" value={form.name} maxLength={50}
              placeholder="e.g. Soft Drink"
              onChange={(e) => set("name", e.target.value)}
              className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 transition"
            />
            <p className="text-[10px] text-gray-600 text-right font-mono">{form.name.length} / 50</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              Category <Dot field="category" />
            </label>
            <input
              type="text" value={form.category}
              placeholder="e.g. Beverages"
              onChange={(e) => set("category", e.target.value)}
              className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 outline-none focus:border-gray-500 transition"
            />
          </div>
        </div>

        {/* Stock Levels */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 mb-2.5">
          <p className="text-[10px] font-medium text-gray-600 uppercase tracking-widest flex items-center gap-2">
            Stock levels <span className="flex-1 border-t border-gray-800" />
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                Quantity <Dot field="quantity" />
              </label>
              <div className="flex">
                <button onClick={() => changeQty(-1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">−</button>
                <input
                  type="number" value={form.quantity} min={0}
                  onChange={(e) => set("quantity", parseInt(e.target.value) || 0)}
                  className="flex-1 h-9 text-center bg-gray-800 border-y border-gray-700 text-sm text-white font-mono outline-none"
                />
                <button onClick={() => changeQty(1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-r-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">+</button>
              </div>
              <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden mt-1">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${status.pct}%`, background: status.color }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                Min stock <Dot field="minStock" />
              </label>
              <div className="flex">
                <button onClick={() => changeMin(-1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-l-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">−</button>
                <input
                  type="number" value={form.minStock} min={0}
                  onChange={(e) => set("minStock", parseInt(e.target.value) || 0)}
                  className="flex-1 h-9 text-center bg-gray-800 border-y border-gray-700 text-sm text-white font-mono outline-none"
                />
                <button onClick={() => changeMin(1)} className="w-8 h-9 bg-gray-800 border border-gray-700 rounded-r-lg text-gray-400 hover:bg-gray-700 transition flex items-center justify-center">+</button>
              </div>
              <p className="text-[10px] mt-1 font-medium" style={{ color: status.color }}>
                ● {status.label}
              </p>
            </div>
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
                className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono outline-none focus:border-gray-500 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Last purchased</label>
              <input type="date" value={form.lastPurchasedDate}
                onChange={(e) => set("lastPurchasedDate", e.target.value)}
                className="w-full h-9 px-3 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white font-mono outline-none focus:border-gray-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => nav("/inventory")}
            className="h-10 px-5 text-sm text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800 transition">
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="flex-1 h-10 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 disabled:opacity-40 transition">
            {saving ? "Saving..." : "Save changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}