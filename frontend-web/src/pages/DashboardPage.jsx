import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import AttendanceMap from "../components/AttendanceMap";
import { registerAttendance } from "../services/attendanceService";
import axios from "axios";

function DashboardPage() {
  const webcamRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAttendance = () => {
    setLoading(true);
    setStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;

          setLocation({ latitud, longitud });
          const foto = webcamRef.current.getScreenshot();
          await registerAttendance({ latitud, longitud, foto });
          setStatus({ tipo: "ok", texto: "Asistencia registrada correctamente" });

        } catch (error) {
          console.error(error);
          setStatus({ tipo: "error", texto: "Error al registrar asistencia. Intenta de nuevo." });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setStatus({ tipo: "error", texto: "No se pudo obtener ubicación. Verifica tu GPS." });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const initials = user?.nombre
    ?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="p-8">

      {/* Bienvenida */}
      <div style={{
        background: "#fff", border: "0.5px solid #e2e8f0",
        borderRadius: "12px", padding: "1.25rem 1.5rem",
        display: "flex", alignItems: "center", gap: "1rem",
        marginBottom: "1.5rem",
      }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "#C9A84C", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "16px", fontWeight: "500",
          color: "#162010", flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "500", color: "#1e293b" }}>
            Bienvenido, {user?.nombre}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
            {user?.rol === "admin" ? "Administrador" : "Empleado"} · Registro de asistencia con GPS
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {status && (
        <div style={{
          marginBottom: "1.25rem", padding: "10px 14px",
          borderRadius: "8px", fontSize: "13px",
          background: status.tipo === "ok" ? "#eaf3de" : "#fcebeb",
          color: status.tipo === "ok" ? "#3B6D11" : "#A32D2D",
          border: `0.5px solid ${status.tipo === "ok" ? "#c0dd97" : "#f7c1c1"}`,
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <i className={`ti ${status.tipo === "ok" ? "ti-circle-check" : "ti-alert-circle"}`}
            style={{ fontSize: "16px" }} aria-hidden="true"></i>
          {status.texto}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Cámara */}
        <div style={{
          background: "#fff", border: "0.5px solid #e2e8f0",
          borderRadius: "12px", padding: "1.25rem",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b", marginBottom: "1rem", alignSelf: "flex-start" }}>
            Cámara de verificación
          </div>

          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: "100%", maxWidth: "380px", borderRadius: "10px",
              border: "0.5px solid #e2e8f0",
            }}
          />

          <button
            onClick={handleAttendance}
            disabled={loading}
            style={{
              marginTop: "1.25rem", width: "100%", maxWidth: "380px",
              padding: "12px", borderRadius: "10px", border: "none",
              fontSize: "14px", fontWeight: "500", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#94a3b8" : "#2D5016",
              color: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px", transition: "background .2s",
            }}
          >
            <i className={`ti ${loading ? "ti-loader-2" : "ti-fingerprint"}`}
              style={{ fontSize: "18px" }} aria-hidden="true"></i>
            {loading ? "Obteniendo ubicación..." : "Marcar Asistencia"}
          </button>
        </div>

        {/* Mapa */}
        <div style={{
          background: "#fff", border: "0.5px solid #e2e8f0",
          borderRadius: "12px", padding: "1.25rem",
        }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: "#1e293b", marginBottom: "1rem" }}>
            Ubicación GPS
          </div>

          {location ? (
            <>
              <AttendanceMap latitud={location.latitud} longitud={location.longitud} />
              <div style={{ marginTop: ".75rem", display: "flex", gap: ".5rem" }}>
                <div style={{ flex: 1, background: "#f8fafc", border: "0.5px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>Latitud</div>
                  <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#1e293b" }}>{location.latitud.toFixed(6)}</div>
                </div>
                <div style={{ flex: 1, background: "#f8fafc", border: "0.5px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "2px" }}>Longitud</div>
                  <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#1e293b" }}>{location.longitud.toFixed(6)}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              height: "260px", background: "#f8fafc", border: "0.5px dashed #e2e8f0",
              borderRadius: "10px", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: "8px",
            }}>
              <i className="ti ti-map-pin-off" style={{ fontSize: "32px" }} aria-hidden="true"></i>
              <div style={{ fontSize: "13px" }}>El mapa aparecerá al marcar asistencia</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;