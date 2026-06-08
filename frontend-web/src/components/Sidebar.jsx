import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const initials = user?.nombre
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "ti-layout-dashboard", roles: ["empleado", "admin"], section: "Principal" },
    { path: "/admin", label: "Asistencias", icon: "ti-clipboard-list", roles: ["admin"], section: "Administración" },
    { path: "/reports", label: "Reportes", icon: "ti-file-analytics", roles: ["admin"], section: null },
    { path: "/users", label: "Usuarios", icon: "ti-users", roles: ["admin"], section: null },
    { path: "/analytics", label: "Analítica", icon: "ti-chart-bar", roles: ["admin"], section: null },
  ];

  const visibleLinks = links.filter((l) => l.roles.includes(user?.rol));

  return (
    <aside style={{
      width: "240px", minHeight: "100vh", background: "#162010",
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.25rem 1rem 1rem",
        borderBottom: "0.5px solid rgba(201,168,76,0.15)",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "#C9A84C", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <i className="ti ti-map-pin" style={{ fontSize: "20px", color: "#162010" }} aria-hidden="true"></i>
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "500", color: "#fff" }}>GeoAsist</div>
          <div style={{ fontSize: "10px", color: "rgba(201,168,76,0.7)", letterSpacing: ".06em", textTransform: "uppercase" }}>COGAE</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: ".5rem .5rem" }}>
        {visibleLinks.map((link, i) => {
          const active = location.pathname === link.path;
          const showSection = link.section !== null && (i === 0 || visibleLinks[i - 1]?.section !== link.section);
          return (
            <div key={link.path}>
              {showSection && (
                <div style={{
                  fontSize: "10px", fontWeight: "500", textTransform: "uppercase",
                  letterSpacing: ".09em", color: "rgba(255,255,255,0.25)",
                  padding: ".85rem .75rem .3rem",
                }}>
                  {link.section}
                </div>
              )}
              <button
                onClick={() => navigate(link.path)}
                style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  width: "100%", padding: ".55rem .75rem", marginBottom: "2px",
                  borderRadius: "8px", border: "none", cursor: "pointer",
                  background: active ? "rgba(201,168,76,0.1)" : "transparent",
                  color: active ? "#C9A84C" : "rgba(255,255,255,0.5)",
                  fontSize: "13px", textAlign: "left",
                  borderLeft: active ? "2px solid #C9A84C" : "2px solid transparent",
                  transition: "all .15s",
                }}
              >
                <i className={`ti ${link.icon}`} style={{ fontSize: "16px" }} aria-hidden="true"></i>
                {link.label}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Usuario */}
      <div style={{
        padding: ".85rem 1rem",
        borderTop: "0.5px solid rgba(201,168,76,0.12)",
        display: "flex", alignItems: "center", gap: "9px",
      }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: "#C9A84C", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "12px", fontWeight: "500",
          color: "#162010", flexShrink: 0,
          border: "1.5px solid rgba(201,168,76,0.4)",
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#fff",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.nombre}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>
            {user?.rol === "admin" ? "Administrador" : "Empleado"}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;