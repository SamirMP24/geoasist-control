import { useEffect, useState } from "react";
import { getAttendances } from "../services/adminService";
import ExportButtons from "../components/ExportButtons";

function ReportsPage() {
  const [attendances, setAttendances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  useEffect(() => { loadAttendances(); }, []);

  useEffect(() => { applyFilters(); }, [filtroNombre, filtroFechaDesde, filtroFechaHasta, attendances]);

  const loadAttendances = async () => {
    try {
      const data = await getAttendances();
      setAttendances(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...attendances];
    if (filtroNombre) result = result.filter((a) => a.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()));
    if (filtroFechaDesde) result = result.filter((a) => new Date(a.fecha) >= new Date(filtroFechaDesde));
    if (filtroFechaHasta) result = result.filter((a) => new Date(a.fecha) <= new Date(filtroFechaHasta + "T23:59:59"));
    setFiltered(result);
  };

  const clearFilters = () => {
    setFiltroNombre("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  const inputStyle = {
    border: "0.5px solid #e2e8f0", borderRadius: "8px",
    padding: "6px 12px", fontSize: "13px", color: "#1e293b",
    background: "#fff", outline: "none", width: "100%",
  };

  const labelStyle = { fontSize: "11px", color: "#94a3b8", marginBottom: "4px", display: "block" };

  return (
    <div className="p-8">

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "500", color: "#1e293b" }}>Reportes</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Filtra y exporta los registros de asistencia</p>
        </div>
        <ExportButtons attendances={filtered} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".75rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem", borderLeft: "2px solid #C9A84C" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Total registros</div>
          <div style={{ fontSize: "24px", fontWeight: "500", color: "#1e293b" }}>{filtered.length}</div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Empleados únicos</div>
          <div style={{ fontSize: "24px", fontWeight: "500", color: "#1e293b" }}>
            {new Set(filtered.map((a) => a.nombre)).size}
          </div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Último registro</div>
          <div style={{ fontSize: "15px", fontWeight: "500", color: "#1e293b" }}>
            {filtered.length > 0
              ? new Date(filtered[0].fecha + "Z").toLocaleDateString("es-PE", { timeZone: "America/Lima" })
              : "—"}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b", marginBottom: ".75rem" }}>Filtros</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", alignItems: "flex-end" }}>
          <div style={{ flex: "1", minWidth: "160px" }}>
            <label style={labelStyle}>Empleado</label>
            <input type="text" placeholder="Buscar por nombre..." value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: "1", minWidth: "140px" }}>
            <label style={labelStyle}>Desde</label>
            <input type="date" value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: "1", minWidth: "140px" }}>
            <label style={labelStyle}>Hasta</label>
            <input type="date" value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={clearFilters} style={{
            fontSize: "12px", color: "#64748b", background: "#f8fafc",
            border: "0.5px solid #e2e8f0", borderRadius: "8px",
            padding: "6px 14px", cursor: "pointer", whiteSpace: "nowrap",
          }}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>Cargando registros...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No hay registros con esos filtros</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
                {["Empleado", "Correo", "Latitud", "Longitud", "Fecha y hora"].map((h) => (
                  <th key={h} style={{ padding: ".6rem 1rem", textAlign: "left", fontSize: "10px", fontWeight: "500", textTransform: "uppercase", letterSpacing: ".06em", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} style={{ borderBottom: "0.5px solid #f1f5f9" }}>
                  <td style={{ padding: ".75rem 1rem", fontSize: "13px", fontWeight: "500", color: "#1e293b" }}>{a.nombre}</td>
                  <td style={{ padding: ".75rem 1rem", fontSize: "13px", color: "#64748b" }}>{a.correo}</td>
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

export default ReportsPage;