import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    try {
      setError("");
      const res = await API.get("/items");
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/items/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

const getDaysLeft = (dateStr) => {
  if (!dateStr) return null;

  const today = new Date();
  const expiry = new Date(dateStr);

  // Normalize both to midnight
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diff = expiry - today;

  return Math.floor(diff / 86400000);
};

  const getStatus = (item) => {
    const daysLeft = getDaysLeft(item.expiryDate);
    if (daysLeft !== null && daysLeft < 0) return "EXPIRED";
    if (daysLeft !== null && daysLeft <= 3) return "EXPIRING";
    if (item.quantity <= item.minStock) return "LOW_STOCK";
    return "OK";
  };

  const lowStock = items.filter(i => i.quantity <= i.minStock);
  const expiring = items.filter(i => {
    const d = getDaysLeft(i.expiryDate);
    return d !== null && d >= 0 && d <= 3;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-40 text-gray-400">
      Loading...
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Inventory</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length} items · {lowStock.length} low stock · {expiring.length} expiring
          </p>
        </div>
        <button
          onClick={() => nav("/add")}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          + Add Item
        </button>
      </div>

      {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Total items</p>
          <p className="text-2xl font-medium text-white">{items.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Low stock</p>
          <p className="text-2xl font-medium text-red-400">{lowStock.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Expiring soon</p>
          <p className="text-2xl font-medium text-yellow-400">{expiring.length}</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const status = getStatus(item);
          const daysLeft = getDaysLeft(item.expiryDate);
          const qtyPct = Math.min(100, Math.round((item.quantity / (item.minStock * 2 || 2)) * 100));
          const isLow = item.quantity <= item.minStock;

          return (
            <div key={item._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">

              {/* Name + Badge */}
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium text-white text-base leading-snug">{item.name}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                  status === "OK"       ? "bg-green-900/60 text-green-400" :
                  status === "LOW_STOCK"? "bg-red-900/60 text-red-400" :
                  status === "EXPIRING" ? "bg-yellow-900/60 text-yellow-400" :
                                          "bg-gray-800 text-gray-400"
                }`}>
                  {status === "OK" ? "OK" : status === "LOW_STOCK" ? "Low stock" : status === "EXPIRING" ? "Expiring" : "Expired"}
                </span>
              </div>

              {/* Qty Progress Bar */}
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isLow ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${qtyPct}%` }}
                />
              </div>

              {/* Meta Info */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Quantity</span>
                  <span className={`text-xs font-mono font-medium ${isLow ? "text-red-400" : "text-white"}`}>
                    {item.quantity} / {item.minStock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Category</span>
                  <span className="text-xs text-gray-300">{item.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Expiry</span>
                  <span className={`text-xs font-mono ${
                    daysLeft !== null && daysLeft < 0 ? "text-red-400" :
                    daysLeft !== null && daysLeft <= 3 ? "text-yellow-400" :
                    "text-gray-300"
                  }`}>
                    {formatDate(item.expiryDate)}
                    {daysLeft !== null && daysLeft >= 0 && ` · ${daysLeft}d left`}
                    {daysLeft !== null && daysLeft < 0 && " · Expired"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last bought</span>
                  <span className="text-xs text-gray-400 font-mono">{formatDate(item.lastPurchasedDate)}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800" />

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => nav(`/edit/${item._id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/60 transition"
                >
                  🗑 Delete
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No items yet</p>
          <a href="/add" className="text-blue-400 text-sm hover:underline">+ Add your first item</a>
        </div>
      )}
    </div>
  );
}