import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";

const pageTitles = {
  "/dashboard": { title: "Dashboard", breadcrumb: "Principal" },
  "/admin": { title: "Asistencias", breadcrumb: "Administración / Asistencias" },
  "/reports": { title: "Reportes", breadcrumb: "Administración / Reportes" },
  "/users": { title: "Usuarios", breadcrumb: "Administración / Usuarios" },
  "/analytics": { title: "Analítica", breadcrumb: "Administración / Analítica" },
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const page = pageTitles[location.pathname] || { title: "GeoAsist", breadcrumb: "" };

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    timeZone: "America/Lima",
  });

  return (
    <header style={{
      height: "52px", background: "#fff",
      borderBottom: "0.5px solid #e2e8f0",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.5rem",
      position: "fixed", top: 0, left: "240px", right: 0, zIndex: 40,
    }}>
      <div>
        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{page.breadcrumb}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          fontSize: "11px", color: "#94a3b8",
          background: "#f8fafc", border: "0.5px solid #e2e8f0",
          borderRadius: "6px", padding: "3px 9px",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <i className="ti ti-calendar" style={{ fontSize: "12px" }} aria-hidden="true"></i>
          {today}
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px", color: "#64748b",
            border: "0.5px solid #e2e8f0", borderRadius: "8px",
            padding: "5px 12px", background: "transparent", cursor: "pointer",
          }}
        >
          <i className="ti ti-logout" style={{ fontSize: "14px" }} aria-hidden="true"></i>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Navbar;