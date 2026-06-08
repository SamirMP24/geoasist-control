import { useEffect, useState } from "react";
import axios from "axios";

function UsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "", password: "", rol: "empleado" });
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => { loadUsuarios(); }, []);

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

  const getInitials = (nombre) =>
    nombre?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

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
          <h1 style={{ fontSize: "20px", fontWeight: "500", color: "#1e293b" }}>Usuarios</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>Gestiona los usuarios del sistema</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMensaje(null); }}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontWeight: "500", color: "#fff",
            background: showForm ? "#64748b" : "#2D5016",
            border: "none", borderRadius: "8px", padding: "7px 14px", cursor: "pointer",
          }}
        >
          <i className={`ti ${showForm ? "ti-x" : "ti-plus"}`} style={{ fontSize: "14px" }} aria-hidden="true"></i>
          {showForm ? "Cancelar" : "Nuevo usuario"}
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div style={{
          marginBottom: "1rem", padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
          background: mensaje.tipo === "ok" ? "#eaf3de" : "#fcebeb",
          color: mensaje.tipo === "ok" ? "#3B6D11" : "#A32D2D",
          border: `0.5px solid ${mensaje.tipo === "ok" ? "#c0dd97" : "#f7c1c1"}`,
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b", marginBottom: "1rem" }}>Crear nuevo usuario</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: ".75rem" }}>
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input type="text" placeholder="Juan Pérez" value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input type="email" placeholder="juan@empresa.com" value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" placeholder="Mínimo 6 caracteres" value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rol</label>
              <select value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })} style={inputStyle}>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={saving} style={{
            marginTop: "1rem", fontSize: "12px", fontWeight: "500", color: "#fff",
            background: saving ? "#94a3b8" : "#2D5016", border: "none",
            borderRadius: "8px", padding: "7px 18px", cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No hay usuarios registrados</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
                {["Usuario", "Correo", "Rol", "Estado"].map((h) => (
                  <th key={h} style={{ padding: ".6rem 1rem", textAlign: "left", fontSize: "10px", fontWeight: "500", textTransform: "uppercase", letterSpacing: ".06em", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "0.5px solid #f1f5f9" }}>
                  <td style={{ padding: ".75rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "#e8f0e2", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "11px", fontWeight: "500",
                        color: "#2D5016", flexShrink: 0,
                      }}>
                        {getInitials(u.nombre)}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b" }}>{u.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: ".75rem 1rem", fontSize: "13px", color: "#64748b" }}>{u.correo}</td>
                  <td style={{ padding: ".75rem 1rem" }}>
                    <span style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "99px", fontWeight: "500",
                      background: u.rol === "admin" ? "rgba(201,168,76,0.15)" : "#f1f5f9",
                      color: u.rol === "admin" ? "#854F0B" : "#64748b",
                    }}>
                      {u.rol === "admin" ? "Administrador" : "Empleado"}
                    </span>
                  </td>
                  <td style={{ padding: ".75rem 1rem" }}>
                    <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "99px", background: "#eaf3de", color: "#3B6D11" }}>
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