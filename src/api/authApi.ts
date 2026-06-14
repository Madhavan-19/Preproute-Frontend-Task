import axiosInstance from "./axiosConfig";

export const loginApi = async (userId: string, password: string) => {
  const response = await axiosInstance.post("/api/auth/login", {
    userId,
    password,
  });

  return response.data;
};