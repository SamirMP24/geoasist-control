const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const register = async (req, res) => {
  try {

    const { nombre, correo, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios(nombre, correo, password, rol)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      nombre,
      correo,
      hashedPassword,
      rol
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Usuario registrado",
      user: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error servidor"
    });
  }
};

const login = async (req, res) => {
  try {

    const { correo, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Usuario no encontrado"
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error servidor"
    });
  }
};

module.exports = {
  register,
  login
};