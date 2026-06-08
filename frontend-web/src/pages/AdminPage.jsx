import { useEffect, useState } from "react";
import { getAttendances } from "../services/adminService";
import ExportButtons from "../components/ExportButtons";

function AdminPage() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const data = await getAttendances();
      setAttendances(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (nombre) =>
    nombre?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="p-8">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "500", color: "#1e293b" }}>Panel de Asistencias</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Registros del sistema con foto y ubicación GPS</p>
        </div>
        <ExportButtons attendances={attendances} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".75rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem", borderLeft: "2px solid #C9A84C" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Total registros</div>
          <div style={{ fontSize: "24px", fontWeight: "500", color: "#1e293b" }}>{attendances.length}</div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Empleados únicos</div>
          <div style={{ fontSize: "24px", fontWeight: "500", color: "#1e293b" }}>
            {new Set(attendances.map((a) => a.nombre)).size}
          </div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Último registro</div>
          <div style={{ fontSize: "15px", fontWeight: "500", color: "#1e293b" }}>
            {attendances.length > 0
              ? new Date(attendances[0].fecha + "Z").toLocaleTimeString("es-PE", { timeZone: "America/Lima", hour: "2-digit", minute: "2-digit" })
              : "—"}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>Cargando registros...</div>
        ) : attendances.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No hay registros aún</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
                {["Empleado", "Correo", "Foto", "Latitud", "Longitud", "Fecha"].map((h) => (
                  <th key={h} style={{ padding: ".6rem 1rem", textAlign: "left", fontSize: "10px", fontWeight: "500", textTransform: "uppercase", letterSpacing: ".06em", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => (
                <tr key={a.id} style={{ borderBottom: "0.5px solid #f1f5f9" }}>
                  <td style={{ padding: ".75rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: "#e8f0e2", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "10px", fontWeight: "500", color: "#2D5016", flexShrink: 0,
                      }}>
                        {getInitials(a.nombre)}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b" }}>{a.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: ".75rem 1rem", fontSize: "13px", color: "#64748b" }}>{a.correo}</td>
                  <td style={{ padding: ".75rem 1rem" }}>
                    {a.foto ? (
                      <img src={a.foto} alt="foto" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: "0.5px solid #e2e8f0" }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="ti ti-user" style={{ fontSize: "16px", color: "#94a3b8" }} aria-hidden="true"></i>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: ".75rem 1rem", fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{parseFloat(a.latitud).toFixed(6)}</td>
                  <td style={{ padding: ".75rem 1rem", fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{parseFloat(a.longitud).toFixed(6)}</td>
                  <td style={{ padding: ".75rem 1rem", fontSize: "12px", color: "#64748b" }}>
                    {new Date(a.fecha + "Z").toLocaleString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;