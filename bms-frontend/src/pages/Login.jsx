import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/users";
import movieImg from "../assets/Img1.jpg";
import "../Auth.css";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinishLoginForm = async (values) => {
    try {
      const response = await loginUser(values);
      if (response.success) {
        messageApi.success("Logged in successfully!");
        localStorage.setItem("token", response.token);
        if (response.role === "Admin") return navigate("/home");
        if (response.role === "Partner") return navigate("/partner");
        return navigate("/");
      } else {
        messageApi.error("Invalid email or password");
      }
    } catch (err) {
      messageApi.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      {contextHolder}

      <div className="register-page">

        {/* LEFT PANEL */}
        <div className="left-panel" style={{ backgroundImage: `url(${movieImg})` }}>
          <div className="overlay">
            <h1>🎬 BookMyShow</h1>
            <p>Welcome back! Dive into movies, events & more</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="register-card">

            <h2>Welcome Back!</h2>
            <p className="card-sub">Login to continue booking</p>

            <Form onFinish={onFinishLoginForm} layout="vertical" size="large">

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 8 }}>
                <Button className="custom-btn" block htmlType="submit">
                  Login
                </Button>
              </Form.Item>

            </Form>

            <p className="login-text">
              Forgot password? <Link to="/forget">Reset here</Link>
            </p>

            <div className="auth-divider">or</div>

            <p className="login-text">
              New user? <Link to="/register">Create an account</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}

export default Login;