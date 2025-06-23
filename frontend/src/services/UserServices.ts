import axios from "axios";
import { User } from "@/types";

const API_URL = "https://college-events-backend-j4bg.onrender.com/api/v1";

export const getAllUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}/users?skip=0&limit=1000`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
