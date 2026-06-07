import { useEffect, useState } from "react";
import axios from "axios";

function UsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "empleado",
  });
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.correo || !formData.password) {
      setMensaje({ tipo: "error", texto: "Todos los campos son requeridos" });
      return;
    }

    setSaving(true);
    setMensaje(null);

    try {
      await axios.post(`${API_URL}/api/auth/register`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje({ tipo: "ok", texto: "Usuario creado correctamente" });
      setFormData({ nombre: "", correo: "", password: "", rol: "empleado" });
      setShowForm(false);
      loadUsuarios();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.response?.data?.message || "Error al crear usuario" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">Usuarios</h1>
          <p className="text-gray-500 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMensaje(null); }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl transition"
        >
          {showForm ? "Cancelar" : "+ Nuevo usuario"}
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium ${
          mensaje.tipo === "ok"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Formulario nuevo usuario */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Crear nuevo usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Nombre completo</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Correo electrónico</label>
              <input
                type="email"
                placeholder="juan@empresa.com"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-8 py-3 rounded-xl transition"
            >
              {saving ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No hay usuarios registrados</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4">Nombre</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{u.nombre}</td>
                  <td className="p-4 text-gray-500">{u.correo}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.rol === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.rol === "admin" ? "Administrador" : "Empleado"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Activo
                    </span>
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

export default UsersPage;
