const pool = require("../database/db");

const registerAttendance = async (
  req,
  res
) => {

  try {

    const {
      latitud,
      longitud,
      foto
    } = req.body;

    const usuario_id =
      req.user.id;

    const query = `
      INSERT INTO asistencias
      (
        usuario_id,
        latitud,
        longitud,
        foto
      )
      VALUES($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      usuario_id,
      latitud,
      longitud,
      foto
    ];

    const result =
      await pool.query(
        query,
        values
      );

    res.status(201).json({
      message:
        "Asistencia registrada",
      attendance:
        result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error servidor"
    });
  }
};

const getAttendances = async (
  req,
  res
) => {

  try {

    const query = `
      SELECT
        asistencias.id,
        usuarios.nombre,
        usuarios.correo,
        asistencias.latitud,
        asistencias.longitud,
        asistencias.foto,
        asistencias.fecha

      FROM asistencias

      INNER JOIN usuarios
      ON usuarios.id =
      asistencias.usuario_id

      ORDER BY
      asistencias.fecha DESC
    `;

    const result =
      await pool.query(query);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error servidor"
    });
  }
};

module.exports = {
  registerAttendance,
  getAttendances
};