import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { LoginForm } from "./Login.type";

const dummyUser = {
  userid: "admin",
  password: "admin123",
  token: "dummy-token-123",
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    try {
      setLoading(true);

      // API Ready Structure (Commented)
      // const response = await axiosInstance.post("/auth/login", values);
      // const token = response.data?.token;
      // localStorage.setItem("token", token);
      // message.success("Login Successful");
      // navigate("/dashboard");

      // Dummy authentication
      if (
        values.userid === dummyUser.userid &&
        values.password === dummyUser.password
      ) {
        localStorage.setItem("token", dummyUser.token);
        message.success("Login Successful");
        navigate("/dashboard");
      } else {
        message.error("Invalid User ID or Password");
      }
    } catch (error: any) {
      message.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
  };
};