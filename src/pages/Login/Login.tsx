import { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input,Typography,message} from "antd";
import {EyeInvisibleOutlined,EyeTwoTone} from "@ant-design/icons";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import LeftImage from "../../assets/images/login-left-images.png";
import logo from "../../assets/images/Preproute-logo.png";

const { Title, Text } = Typography;

type LoginForm = {
  userid: string;
  password: string;
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const onFinish: FormProps<LoginForm>["onFinish"] =
  async (values) => {
    try {
      setLoading(true);

      // Dummy Credentials
      const dummyUser = {
        userid: "admin",
        password: "admin123",
        token: "dummy-token-123",
      };

      // API Ready Structure
      // const response = await axiosInstance.post(
      //   "/auth/login",
      //   values
      // );

      // const token = response.data?.token;

      if (
        values.userid === dummyUser.userid &&
        values.password === dummyUser.password
      ) {
        localStorage.setItem(
          "token",
          dummyUser.token
        );

        message.success("Login Successful");

        navigate("/dashboard");
      } else {
        message.error(
          "Invalid User ID or Password"
        );
      }
    } catch (error: any) {
      message.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Section */}
      <div className="left-section">
        <img src={LeftImage} alt="Login Illustration" className="illustration" />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="login-container">
          <img src={logo} alt="Logo" className="logo" />
          <Title level={2} className="login-title">Login</Title>
          <Text type="secondary" className="login-subtitle">Use your company provided login credentials</Text>

          <Form<LoginForm> layout="vertical" onFinish={onFinish} className="login-form" >
            <Form.Item
              label="User ID"
              name="userid"
              rules={[
                {
                  required: true,
                  message: "Please enter User ID",
                },
              ]}
            >
              <Input size="large" placeholder="Enter User ID" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter Password",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone />
                  ) : (
                    <EyeInvisibleOutlined />
                  )
                }
              />
            </Form.Item>

            <div className="forgot-password">
              <a href="/">Forgot Password?</a>
            </div>

            <Button
              className="login-button"
              
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}