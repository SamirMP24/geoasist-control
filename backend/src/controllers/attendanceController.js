const supabase = require('../database/db');

const base64ToBuffer = (base64String) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

const registerAttendance = async (req, res) => {
  try {
    const { latitud, longitud, foto } = req.body;
    const usuario_id = req.user.id;

    if (!latitud || !longitud) {
      return res.status(400).json({ message: 'Latitud y longitud son requeridas' });
    }

    let foto_url = null;

    if (foto) {
      const buffer = base64ToBuffer(foto);
      const fileName = `${usuario_id}/${Date.now()}.jpg`;

      const { error: storageError } = await supabase.storage
        .from('fotos-asistencia')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (!storageError) {
        const { data: urlData } = supabase.storage
          .from('fotos-asistencia')
          .getPublicUrl(fileName);
        foto_url = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('asistencias')
      .insert([{ usuario_id, latitud, longitud, foto_url }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error guardando asistencia' });
    }

    res.status(201).json({
      message: 'Asistencia registrada correctamente',
      attendance: data
    });

  } catch (error) {
    console.error('Error en registerAttendance:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getAttendances = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('asistencias')
      .select(`
        id,
        latitud,
        longitud,
        foto_url,
        fecha,
        usuarios (
          nombre,
          correo
        )
      `)
      .order('fecha', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error obteniendo asistencias' });
    }

    const formatted = data.map(a => ({
      id: a.id,
      nombre: a.usuarios?.nombre,
      correo: a.usuarios?.correo,
      latitud: a.latitud,
      longitud: a.longitud,
      foto: a.foto_url,
      fecha: a.fecha
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Error en getAttendances:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { registerAttendance, getAttendances };