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

  useEffect(() => {
    loadAttendances();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filtroNombre, filtroFechaDesde, filtroFechaHasta, attendances]);

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

    if (filtroNombre) {
      result = result.filter((a) =>
        a.nombre?.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    if (filtroFechaDesde) {
      result = result.filter(
        (a) => new Date(a.fecha) >= new Date(filtroFechaDesde)
      );
    }

    if (filtroFechaHasta) {
      result = result.filter(
        (a) => new Date(a.fecha) <= new Date(filtroFechaHasta + "T23:59:59")
      );
    }

    setFiltered(result);
  };

  const clearFilters = () => {
    setFiltroNombre("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">Reportes</h1>
      <p className="text-gray-500 mb-8">Filtra y exporta los registros de asistencia</p>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Empleado</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm transition"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Total registros</p>
          <p className="text-3xl font-bold text-blue-700">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Empleados únicos</p>
          <p className="text-3xl font-bold text-green-600">
            {new Set(filtered.map((a) => a.nombre)).size}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Último registro</p>
          <p className="text-lg font-semibold text-gray-700">
            {filtered.length > 0
              ? new Date(filtered[0].fecha).toLocaleDateString("es-PE", { timeZone: "America/Lima" })
              : "—"}
          </p>
        </div>
      </div>

      {/* Exportar */}
      <ExportButtons attendances={filtered} />

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Cargando registros...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No hay registros con esos filtros</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4">Empleado</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Latitud</th>
                <th className="p-4">Longitud</th>
                <th className="p-4">Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{a.nombre}</td>
                  <td className="p-4 text-gray-500">{a.correo}</td>
                  <td className="p-4 text-gray-500">{a.latitud}</td>
                  <td className="p-4 text-gray-500">{a.longitud}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(a.fecha).toLocaleString("es-PE", { timeZone: "America/Lima" })}
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
