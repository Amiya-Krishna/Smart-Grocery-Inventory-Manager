import { useEffect, useState } from "react";
import API from "../utils/api";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { sendNotification } from "../utils/notifications";
import { generateSmartList } from "../utils/insight";
import { getPrediction } from "../services/aiService";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    API.get("/items").then((res) => setItems(res.data));
  }, []);

  const getSuggestions = async () => {
    try {
      const res = await fetch("http://localhost:8000/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            minStock: item.minStock,
            lastPurchasedDays: item.lastPurchasedDate
              ? Math.max(0, Math.floor((new Date() - new Date(item.lastPurchasedDate)) / 86400000))
              : 7
          }))
        })
      });
      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Error fetching AI suggestions", err);
    }
  };

  const handleAISuggestions = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const result = await getPrediction({
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          minStock: item.minStock || 1,
          lastPurchasedDays: item.lastPurchasedDate
            ? Math.floor((new Date() - new Date(item.lastPurchasedDate)) / 86400000)
            : 5
        }))
      });
      setAiSuggestion(result.suggestions);
    } catch (err) {
      setAiError("Unable to fetch AI suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  const lowStock = items.filter(i => i.quantity <= i.minStock);
  const expiring = items.filter(i => {
    if (!i.expiryDate) return false;
    const d = Math.ceil((new Date(i.expiryDate) - new Date()) / 86400000);
    return d >= 0 && d <= 3;
  });

  useEffect(() => {
    if (lowStock.length > 0) {
      sendNotification("Low Stock Alert", `${lowStock.length} items need restocking`);
    }
  }, [lowStock.length]);

  const chartData = [
    { name: "Healthy", value: items.length - lowStock.length },
    { name: "Low Stock", value: lowStock.length },
    { name: "Expiring", value: expiring.length },
  ];
  const COLORS = ["#4ade80", "#f87171", "#facc15"];

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Inventory overview</p>
        </div>
        <span className="text-xs text-gray-500 font-mono">{today}</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total items", value: items.length, color: "text-white" },
          { label: "Low stock", value: lowStock.length, color: "text-red-400" },
          { label: "Expiring soon", value: expiring.length, color: "text-yellow-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Quick Stats Row */}
      <div className="grid grid-cols-2 gap-3">

        {/* Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            📊 Inventory health
          </h2>
          <PieChart width={240} height={180}>
            <Pie data={chartData} dataKey="value" outerRadius={75} innerRadius={40}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#111827", border: "1px solid #374151",
                borderRadius: "8px", fontSize: "12px", color: "#e5e7eb"
              }}
            />
          </PieChart>
          <div className="flex gap-4 mt-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 flex items-center gap-2">
            🛒 Items to buy:
            <span className="text-green-400 font-medium text-sm">
              {generateSmartList(items).length}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">📈 Quick stats</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Total items", val: items.length },
              {
                label: "Avg quantity",
                val: items.length
                  ? (items.reduce((s, i) => s + i.quantity, 0) / items.length).toFixed(1)
                  : 0
              },
              {
                label: "Categories",
                val: new Set(items.map(i => i.category)).size
              },
              {
                label: "Health score",
                val: items.length
                  ? `${Math.round(((items.length - lowStock.length) / items.length) * 100)}%`
                  : "—",
                green: true
              },
            ].map(({ label, val, green }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{label}</span>
                <span className={`font-mono text-sm ${green ? "text-green-400" : "text-white"}`}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white flex items-center gap-2">
            ✨ AI suggestions
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-400 border border-blue-800/50">
              FastAPI
            </span>
          </h2>
          <button
            onClick={getSuggestions}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            ↻ Get suggestions
          </button>
        </div>
        {suggestions.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                <span className="text-green-400 mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 italic">
            Click "Get suggestions" to fetch AI-powered restock advice.
          </p>
        )}
      </div>

      {/* ML Predictions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white flex items-center gap-2">
            🧠 ML predictions
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800/50">
              Model
            </span>
          </h2>
          <button
            onClick={handleAISuggestions}
            disabled={aiLoading}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 disabled:opacity-50 transition"
          >
            ▶ {aiLoading ? "Running..." : "Run prediction"}
          </button>
        </div>
        {aiSuggestion ? (
          <pre className="text-xs font-mono text-green-400 bg-gray-800/50 rounded-lg p-3 overflow-auto">
            {JSON.stringify(aiSuggestion, null, 2)}
          </pre>
        ) : (
          <p className="text-xs text-gray-500 italic">
            Run the model to see restock predictions based on usage patterns.
          </p>
        )}
        {aiError && <p className="text-xs text-red-400">{aiError}</p>}
      </div>

    </div>
  );
}