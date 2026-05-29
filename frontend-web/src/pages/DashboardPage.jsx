import { useState, useRef } from "react";

import Webcam from "react-webcam";

import { useNavigate } from "react-router-dom";

import AttendanceMap from "../components/AttendanceMap";

import {
  registerAttendance
} from "../services/attendanceService";

import {
  calculateDistance
} from "../utils/distanceCalculator";

function DashboardPage() {

  const webcamRef = useRef(null);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [location, setLocation] =
    useState(null);

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");
  };

  const handleAttendance = () => {

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        try {

          const latitud =
            position.coords.latitude;

          const longitud =
            position.coords.longitude;
          
          const officeLat =
            -12.046374;

          const officeLon =
            -77.042793;

          const distance =
            calculateDistance(
              latitud,
              longitud,
              officeLat,
              officeLon
            );
            if (distance > 50) {

              alert(
                "Fuera de la zona permitida"
              );

              return;
            }
          setLocation({
            latitud,
            longitud
          });

          const foto =
            webcamRef.current.getScreenshot();

          const attendanceData = {
            latitud,
            longitud,
            foto
          };

          const response =
            await registerAttendance(
              attendanceData
            );

          console.log(response);

          alert(
            "Asistencia registrada"
          );

        } catch (error) {

          console.log(error);

          alert(
            "Error registrando asistencia"
          );
        }
      }
    );
  };
 (error) => {

    console.log(error);

    alert(
      "No se pudo obtener ubicación"
    );
  },

  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };
  return (

    <div className="p-10 min-h-screen bg-gray-100">

      <div className="
        flex
        justify-between
        items-center
        bg-white
        p-6
        rounded-2xl
        shadow-md
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
            text-blue-700
          ">
            Dashboard
          </h1>

          <p className="
            mt-4
            text-gray-600
            text-lg
          ">
            Bienvenido:
            <span className="
              font-bold
              ml-2
            ">
              {user?.nombre}
            </span>
          </p>

        </div>

        <button
          onClick={logout}
          className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-6
            py-3
            rounded-xl
            transition
          "
        >
          Cerrar Sesión
        </button>
        <p className="mt-4 text-gray-600">
         Radio permitido:
         50 metros
        </p>
      </div>

      <div className="
        mt-10
        bg-white
        p-6
        rounded-2xl
        shadow-md
        flex
        flex-col
        items-center
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-6
          text-gray-700
        ">
          Cámara de Verificación
        </h2>

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="
            rounded-2xl
            w-[450px]
            border-4
            border-blue-500
          "
        />

        <button
          onClick={handleAttendance}
          className="
            mt-8
            bg-green-600
            hover:bg-green-700
            text-white
            px-10
            py-4
            rounded-2xl
            text-xl
            transition
          "
        >
          Marcar Asistencia
        </button>

      </div>

      {
        location && (

          <div className="
            mt-10
            bg-white
            p-6
            rounded-2xl
            shadow-md
          ">

            <h2 className="
              text-2xl
              font-bold
              mb-6
              text-gray-700
            ">
              Ubicación del Trabajador
            </h2>

            <AttendanceMap
              latitud={location.latitud}
              longitud={location.longitud}
            />

          </div>
        )
      }

    </div>
  );
}

export default DashboardPage;