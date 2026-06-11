import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #162010 0%, #2D5016 60%, #1C2E0F 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>

      {/* Card */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "400px",
        boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="/img/LOGO_COGAE.png"
            alt="Logo COGAE"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              margin: "0 auto 1rem",
              display: "block",
            }}
          />
          <div style={{ fontSize: "22px", fontWeight: "500", color: "#1e293b" }}>GeoAsist</div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", letterSpacing: ".06em", textTransform: "uppercase" }}>
            COGAE · Sistema de Asistencia
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: "1rem", padding: "10px 14px", borderRadius: "8px",
            background: "#fcebeb", color: "#A32D2D",
            border: "0.5px solid #f7c1c1", fontSize: "13px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <i className="ti ti-alert-circle" style={{ fontSize: "15px" }} aria-hidden="true"></i>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>

          <div>
            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "5px" }}>
              Correo electrónico
            </label>
            <div style={{ position: "relative" }}>
              <i className="ti ti-mail" style={{
                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                fontSize: "16px", color: "#94a3b8",
              }} aria-hidden="true"></i>
              <input
                type="email"
                name="correo"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={handleChange}
                required
                style={{
                  width: "100%", padding: "10px 12px 10px 38px",
                  border: "0.5px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "13px", color: "#1e293b", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "5px" }}>
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <i className="ti ti-lock" style={{
                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                fontSize: "16px", color: "#94a3b8",
              }} aria-hidden="true"></i>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%", padding: "10px 12px 10px 38px",
                  border: "0.5px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "13px", color: "#1e293b", outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: ".25rem", width: "100%", padding: "11px",
              borderRadius: "8px", border: "none",
              background: loading ? "#94a3b8" : "#2D5016",
              color: "#fff", fontSize: "14px", fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "background .2s",
            }}
          >
            <i className={`ti ${loading ? "ti-loader-2" : "ti-login"}`}
              style={{ fontSize: "16px" }} aria-hidden="true"></i>
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>

        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "11px", color: "#94a3b8" }}>
          GeoAsist v1.0 · COGAE © 2026
        </div>

      </div>
    </div>
  );
}

export default LoginPage;