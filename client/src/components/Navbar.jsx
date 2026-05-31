import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-white bg-gray-800"
      : "text-gray-400 hover:text-white hover:bg-gray-800/50";

  return (
    <nav className="flex items-center justify-between px-6 h-12 bg-gray-950 border-b border-gray-800/60">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-black text-xs">🧺</span>
        </div>
        <span className="text-sm font-medium text-white">Smart Grocery</span>
      </Link>

      {/* Nav Links */}
      {token ? (
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`text-sm px-3 py-1.5 rounded-lg transition ${isActive("/")}`}
          >
            Dashboard
          </Link>
          <Link
            to="/inventory"
            className={`text-sm px-3 py-1.5 rounded-lg transition ${isActive("/inventory")}`}
          >
            Inventory
          </Link>
          <Link
            to="/add"
            className={`text-sm px-3 py-1.5 rounded-lg transition ${isActive("/add")}`}
          >
            Add item
          </Link>

          {/* Divider */}
          <div className="w-px h-4 bg-gray-700 mx-2" />

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-white bg-red-700 border border-red-900/60 px-3 py-1.5 rounded-lg hover:bg-red-950/20 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Link
            to="/login"
            className="text-sm text-white bg-white/10 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-white/20 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm text-white bg-white/10 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-white/20 transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}