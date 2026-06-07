import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard", roles: ["empleado", "admin"] },
    { path: "/admin", label: "Asistencias", roles: ["admin"] },
    { path: "/reports", label: "Reportes", roles: ["admin"] },
    { path: "/users", label: "Usuarios", roles: ["admin"] },
    { path: "/analytics", label: "Analítica", roles: ["admin"] },
  ];

  const visibleLinks = links.filter((l) => l.roles.includes(user?.rol));

  return (
    <nav className="bg-blue-700 text-white px-8 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">GeoAsist</span>
      </div>

      <div className="flex items-center gap-2">
        {visibleLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              location.pathname === link.path
                ? "bg-white text-blue-700"
                : "hover:bg-blue-600"
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">{user?.nombre}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;