import axios from "axios";

const API_URL =
  "http://localhost:3000/api/attendance";

export const registerAttendance =
  async (attendanceData) => {

    const token =
      localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/register`,
      attendanceData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
};