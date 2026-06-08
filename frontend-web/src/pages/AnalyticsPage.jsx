import {
  useEffect,
  useState
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  getAttendances
} from "../services/adminService";

import StatCard from
  "../components/StatCard";

function AnalyticsPage() {

  const [attendances,
    setAttendances] =
      useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const data =
        await getAttendances();

      setAttendances(data);

    } catch (error) {

      console.log(error);
    }
  };

  const totalAttendances =
    attendances.length;

  const uniqueEmployees =
    new Set(
      attendances.map(
        item => item.correo
      )
    ).size;

  const chartData =
    attendances.map(
      (item, index) => ({
        nombre:
          item.nombre,
        asistencia:
          index + 1
      })
    );

  return (

    <div className="p-8">

      <h1 className="
        text-4xl
        font-bold
        text-blue-700
        mb-10
      ">
        Dashboard Estadístico
      </h1>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        <StatCard
          title="Total Asistencias"
          value={totalAttendances}
        />

        <StatCard
          title="Empleados Únicos"
          value={uniqueEmployees}
        />

      </div>

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
        ">
          Asistencias Registradas
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <BarChart
            data={chartData}
          >

            <XAxis dataKey="nombre" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="asistencia"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AnalyticsPage;