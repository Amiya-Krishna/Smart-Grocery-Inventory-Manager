import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-gray-900 p-4 fixed">
      <h1 className="text-xl font-bold mb-6">🥦 Grocery OS</h1>

      <div className="flex flex-col gap-4">
        <Link to="/">📊 Dashboard</Link>
        <Link to="/inventory">📦 Inventory</Link>
        <Link to="/add">➕ Add Item</Link>
      </div>
    </div>
  );
}