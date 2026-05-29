const express = require("express");
const cors = require("cors");

const pool = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "GeoAsist API funcionando"
  });
});

const PORT = 3000;

pool.connect()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});