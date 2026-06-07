const supabase = require('../database/db');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id, rol, nombre')
      .eq('auth_id', user.id)
      .single();

    req.user = {
      id: perfil?.id,
      auth_id: user.id,
      email: user.email,
      rol: perfil?.rol || 'empleado',
      nombre: perfil?.nombre
    };

    next();

  } catch (error) {
    console.error('Error en middleware:', error);
    res.status(500).json({ message: 'Error de autenticación' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado — se requiere rol admin' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };