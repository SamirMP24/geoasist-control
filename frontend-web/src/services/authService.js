import { supabase } from '../lib/supabase';

export const loginUser = async ({ correo, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password
  });

  if (error) throw new Error(error.message);

  const { data: perfil, error: perfilError } = await supabase
    .from('usuarios')
    .select('id, nombre, correo, rol')
    .eq('auth_id', data.user.id)
    .single();

  if (perfilError) throw new Error('No se pudo obtener el perfil');

  const token = data.session.access_token;
  const user  = { id: perfil.id, nombre: perfil.nombre, correo: perfil.correo, rol: perfil.rol };

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return { token, user };
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};