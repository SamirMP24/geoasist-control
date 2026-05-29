import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from
  "jspdf-autotable";

function ExportButtons({
  attendances
}) {

  const exportExcel = () => {

    const data =
      attendances.map(
        (item) => ({
          Empleado:
            item.nombre,

          Correo:
            item.correo,

          Latitud:
            item.latitud,

          Longitud:
            item.longitud,

          Fecha:
            new Date(
              item.fecha
            ).toLocaleString(
              "es-PE",
              {
                timeZone:
                  "America/Lima"
              }
            )
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        data
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Asistencias"
    );

    XLSX.writeFile(
      workbook,
      "reporte_asistencias.xlsx"
    );
  };

  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.text(
      "Reporte de Asistencias",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[
        "Empleado",
        "Correo",
        "Latitud",
        "Longitud",
        "Fecha"
      ]],

      body:
        attendances.map(
          (item) => ([
            item.nombre,

            item.correo,

            item.latitud,

            item.longitud,

            new Date(
              item.fecha
            ).toLocaleString(
              "es-PE",
              {
                timeZone:
                  "America/Lima"
              }
            )
          ])
        )
    });

    doc.save(
      "reporte_asistencias.pdf"
    );
  };

  return (

    <div className="
      flex
      gap-4
      mb-6
    ">

      <button
        onClick={exportExcel}
        className="
          bg-green-600
          text-white
          px-6
          py-3
          rounded-xl
        "
      >
        Exportar Excel
      </button>

      <button
        onClick={exportPDF}
        className="
          bg-red-600
          text-white
          px-6
          py-3
          rounded-xl
        "
      >
        Exportar PDF
      </button>

    </div>
  );
}

export default ExportButtons;