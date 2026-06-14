import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { LoginForm } from "./Login.type";
import { loginApi } from "../../api/authApi";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    try {
      setLoading(true);
        const data = await loginApi(
        values.userId,
        values.password
      );
     console.log("LOGIN RESPONSE:", data);

      const token = data?.data?.token;
      const user = data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Login Successful");
        navigate("/dashboard");
      } else {
        message.error("Token not found");
      }

    } catch (error: any) {
      console.log(error?.response);
      message.error(
        error?.response?.data?.message ||
        error?.message ||
        "Login Failed"
      );
    }
    finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
  };
};