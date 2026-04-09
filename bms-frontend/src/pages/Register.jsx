import { Button, Form, Input, Radio, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/users";
import movieImg from "../assets/Img1.jpg";
import "../Auth.css";

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinishRegistrationForm = async (values) => {
    try {
      const response = await registerUser(values);
      if (response.success) {
        messageApi.success("Registration successful!");
        navigate("/login");
      } else {
        messageApi.error("Something went wrong");
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
            <p>Book tickets for movies, events & more</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="register-card">

            <h2>Create Account</h2>
            <p className="card-sub">Join us and start booking today</p>

            <Form onFinish={onFinishRegistrationForm} layout="vertical" size="large">

              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

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
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Minimum 6 characters" },
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Form.Item
                label="Select Role"
                name="role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Radio.Group>
                  <Radio value="User">User</Radio>
                  <Radio value="Admin">Admin</Radio>
                  <Radio value="Partner">Partner</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item style={{ marginBottom: 8 }}>
                <Button className="custom-btn" block htmlType="submit">
                  Register
                </Button>
              </Form.Item>

            </Form>

            <div className="auth-divider">or</div>

            <p className="login-text">
              Already have an account? <Link to="/login">Login now</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}

export default Register;