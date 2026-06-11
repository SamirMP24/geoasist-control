import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getAttendances } from "../services/adminService";

function AnalyticsPage() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await getAttendances();
      setAttendances(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalAttendances = attendances.length;
  const uniqueEmployees = new Set(attendances.map((a) => a.correo)).size;

  // Asistencias por empleado
  const porEmpleado = attendances.reduce((acc, a) => {
    acc[a.nombre] = (acc[a.nombre] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(porEmpleado).map(([nombre, total]) => ({
    nombre: nombre?.split(" ")[0], // solo primer nombre para el eje
    total,
  }));

  // Asistencias por día
  const porDia = attendances.reduce((acc, a) => {
    const dia = new Date(a.fecha + "Z").toLocaleDateString("es-PE", {
      timeZone: "America/Lima", day: "2-digit", month: "short",
    });
    acc[dia] = (acc[dia] || 0) + 1;
    return acc;
  }, {});

  const chartDias = Object.entries(porDia).map(([dia, total]) => ({ dia, total }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}>
          <div style={{ fontWeight: "500", color: "#1e293b", marginBottom: "2px" }}>{label}</div>
          <div style={{ color: "#2D5016" }}>{payload[0].value} registro{payload[0].value !== 1 ? "s" : ""}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "500", color: "#1e293b" }}>Analítica</h1>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Estadísticas de asistencia del sistema</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".75rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem", borderLeft: "2px solid #C9A84C" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Total asistencias</div>
          <div style={{ fontSize: "28px", fontWeight: "500", color: "#1e293b" }}>{totalAttendances}</div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Empleados únicos</div>
          <div style={{ fontSize: "28px", fontWeight: "500", color: "#1e293b" }}>{uniqueEmployees}</div>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: ".85rem 1rem" }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: ".2rem" }}>Promedio por empleado</div>
          <div style={{ fontSize: "28px", fontWeight: "500", color: "#1e293b" }}>
            {uniqueEmployees > 0 ? (totalAttendances / uniqueEmployees).toFixed(1) : "—"}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>Cargando datos...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

          {/* Gráfico por empleado */}
          <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b", marginBottom: "1rem" }}>
              Asistencias por empleado
            </div>
            {chartData.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem", fontSize: "13px" }}>Sin datos</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="nombre" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#2D5016" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Gráfico por día */}
          <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b", marginBottom: "1rem" }}>
              Asistencias por día
            </div>
            {chartDias.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "2rem", fontSize: "13px" }}>Sin datos</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartDias} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;