import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/attendance`;

export const getAttendances = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/all`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};