import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async ({ correo, password }) => {
  const { data } = await axios.post(`${API_URL}/api/auth/login`, {
    correo,
    password,
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const logoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};