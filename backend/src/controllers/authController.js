const supabase = require('../database/db');

const register = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'Nombre, correo y password son requeridos' });
    }

    const rolFinal = rol === 'admin' ? 'admin' : 'empleado';

    const { data, error } = await supabase.auth.admin.createUser({
      email: correo,
      password,
      email_confirm: true,
      user_metadata: { nombre, rol: rolFinal }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: { id: data.user.id, nombre, correo, rol: rolFinal }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y password son requeridos' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password
    });

    if (error) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, rol')
      .eq('auth_id', data.user.id)
      .single();

    res.json({
      message: 'Login exitoso',
      token: data.session.access_token,
      user: {
        id: perfil?.id,
        nombre: perfil?.nombre,
        correo: perfil?.correo,
        rol: perfil?.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, rol')
      .order('id', { ascending: true });

    if (error) return res.status(500).json({ message: 'Error obteniendo usuarios' });

    res.json(data);
  } catch (error) {
    console.error('Error en getUsers:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { register, login, getUsers };