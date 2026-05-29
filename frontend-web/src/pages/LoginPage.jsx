import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      console.log(data);

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login exitoso");

      navigate("/dashboard");

  } catch (error) {

  console.log(
    error.response?.data || error.message
  );

  alert("Credenciales incorrectas");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          GeoAsist Control
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Iniciar Sesión
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >

          <input
            type="email"
            name="correo"
            placeholder="Correo"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <button
            className="w-full bg-blue-700 text-white p-3 rounded-xl hover:bg-blue-800"
          >
            Ingresar
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;