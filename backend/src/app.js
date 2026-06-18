const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes       = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

const configRoutes = require('./routes/configRoutes');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth',       authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GeoAsist API funcionando con Supabase' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  
  app.use('/api/config', configRoutes);
});