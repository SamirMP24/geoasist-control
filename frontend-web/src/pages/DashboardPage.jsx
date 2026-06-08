import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import AttendanceMap from "../components/AttendanceMap";
import { registerAttendance } from "../services/attendanceService";
import { calculateDistance } from "../utils/distanceCalculator";

function DashboardPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAttendance = () => {
    setLoading(true);

    const officeLat = import.meta.env.VITE_OFFICE_LAT
      ? parseFloat(import.meta.env.VITE_OFFICE_LAT)
      : -12.046374;

    const officeLon = import.meta.env.VITE_OFFICE_LON
      ? parseFloat(import.meta.env.VITE_OFFICE_LON)
      : -77.042793;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;

          console.log("Mi ubicación:", latitud, longitud);
          console.log("Oficina:", officeLat, officeLon);

          const distance = calculateDistance(latitud, longitud, officeLat, officeLon);
          console.log("Distancia en metros:", distance);

          if (distance > 50) {
            alert("Fuera de la zona permitida (más de 50 metros de la oficina)");
            setLoading(false);
            return;
          }

          setLocation({ latitud, longitud });

          const foto = webcamRef.current.getScreenshot();
          const response = await registerAttendance({ latitud, longitud, foto });
          console.log(response);
          alert("✅ Asistencia registrada correctamente");

        } catch (error) {
          console.error("Error registrando asistencia:", error);
          alert("Error al registrar asistencia. Intenta de nuevo.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        alert("No se pudo obtener ubicación. Verifica tu GPS.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-md">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">Dashboard</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Bienvenido: <span className="font-bold ml-2">{user?.nombre}</span>
          </p>
          <p className="mt-1 text-sm text-gray-400">Radio permitido: 50 metros</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Cámara de Verificación</h2>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-2xl w-[450px] border-4 border-blue-500"
        />
        <button
          onClick={handleAttendance}
          disabled={loading}
          className="mt-8 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-10 py-4 rounded-2xl text-xl transition"
        >
          {loading ? "Obteniendo ubicación..." : "Marcar Asistencia"}
        </button>
      </div>

      {location && (
        <div className="mt-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Ubicación del Trabajador</h2>
          <AttendanceMap latitud={location.latitud} longitud={location.longitud} />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;