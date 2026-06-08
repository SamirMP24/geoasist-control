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
  <div style={{ display: "flex", gap: ".5rem" }}>
    <button
      onClick={exportExcel}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "12px", fontWeight: "500", color: "#2D5016",
        background: "#eaf3de", border: "0.5px solid #c0dd97",
        borderRadius: "8px", padding: "6px 14px", cursor: "pointer",
      }}
    >
      <i className="ti ti-file-spreadsheet" style={{ fontSize: "14px" }} aria-hidden="true"></i>
      Excel
    </button>
    <button
      onClick={exportPDF}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "12px", fontWeight: "500", color: "#fff",
        background: "#2D5016", border: "none",
        borderRadius: "8px", padding: "6px 14px", cursor: "pointer",
      }}
    >
      <i className="ti ti-file-type-pdf" style={{ fontSize: "14px" }} aria-hidden="true"></i>
      PDF
    </button>
  </div>
);
}

export default ExportButtons;