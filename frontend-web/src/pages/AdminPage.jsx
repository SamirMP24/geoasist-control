import {
  useEffect,
  useState
} from "react";

import {
  getAttendances
} from "../services/adminService";

import ExportButtons
from "../components/ExportButtons";
function AdminPage() {

  const [attendances,
    setAttendances] =
      useState([]);

  useEffect(() => {

    loadAttendances();

  }, []);

  const loadAttendances =
    async () => {

      try {

        const data =
          await getAttendances();

        setAttendances(data);

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="
      p-10
      min-h-screen
      bg-gray-100
    ">

      <h1 className="
        text-4xl
        font-bold
        mb-10
        text-blue-700
      ">
        Panel Administrador
      </h1>
        <ExportButtons
         attendances={attendances}
        />
      <div className="
        overflow-x-auto
        bg-white
        rounded-2xl
        shadow-md
      ">

        <table className="
          w-full
          text-left
        ">

          <thead className="
            bg-blue-700
            text-white
          ">

            <tr>

              <th className="p-4">
                Empleado
              </th>

              <th className="p-4">
                Correo
              </th>

              <th className="p-4">
                Foto
              </th>

              <th className="p-4">
                Latitud
              </th>

              <th className="p-4">
                Longitud
              </th>

              <th className="p-4">
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {
              attendances.map(
                (attendance) => (

                <tr
                  key={attendance.id}
                  className="
                    border-b
                  "
                >

                  <td className="p-4">
                    {attendance.nombre}
                  </td>

                  <td className="p-4">
                    {attendance.correo}
                  </td>

                  <td className="p-4">

                    <img
                      src={attendance.foto}
                      alt="foto"
                      className="
                        w-24
                        rounded-xl
                      "
                    />

                  </td>

                  <td className="p-4">
                    {attendance.latitud}
                  </td>

                  <td className="p-4">
                    {attendance.longitud}
                  </td>

                  <td className="p-4">
                    {
                      new Date(
                            attendance.fecha
                            ).toLocaleString(
                            "es-PE",
                            {
                                timeZone:
                                "America/Lima"
                            }
                            )
                    }
                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminPage;