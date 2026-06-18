const express = require("express");
const router = express.Router();
const supabase = require("../database/db");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("configuracion")
      .select("clave, valor");

    if (error) return res.status(500).json({ message: "Error obteniendo configuración" });

    const config = {};
    data.forEach((item) => {
      config[item.clave] = item.valor;
    });

    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;