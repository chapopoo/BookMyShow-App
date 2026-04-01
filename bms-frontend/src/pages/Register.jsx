import React from "react";
import { Button, Form, Input, message, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../api/users";
import { showLoading } from "../redux/loaderSlice"
import movieImg from "../assets/Img1.jpg";

function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinishRegistrationForm = async (values) => {
    // extract isAdmin and isPartner from values and restValues will contain the remaining properties of values object
    const { isAdmin, isPartner, ...restValues } = values

    if (isAdmin === "Admin") {
      restValues.role = "Admin";
    }
    if (isPartner === "Partner") {
      restValues.role = "Partner";
    }

    try {
      const response = await registerUser(restValues);
      if (response.success) {
        messageApi.success("User registration is Successful");
        navigate("/login");
      }
      else {
        messageApi.error("Something went wrong");
      }
    }
    catch (err) {
      messageApi.error(err.response.data.message)
      console.log("error", err)
    }
  }
  return (
    <>
      {contextHolder}

      <div className="register-page">

        {/* LEFT SIDE */}
        <div
          className="left-panel"
          style={{
            backgroundImage: `url(${movieImg})`,
          }}
        >
          <div className="overlay">
            <h1>🎬 BookMyShow</h1>
            <p>Book tickets for movies, events & more</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <div className="register-card">

            <h2>Create Account</h2>

            <Form
              onFinish={onFinishRegistrationForm}
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true },
                  { type: "email", message: "Enter valid email" }
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true },
                  { min: 6, message: "Minimum 6 characters" }
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              {/* ROLE SELECTION */}
              <Form.Item
                label="Select Role"
                name="role"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value="User">User</Radio>
                  <Radio value="Admin">Admin</Radio>
                  <Radio value="Partner">Partner</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button className="custom-btn" block htmlType="submit">
                  Register
                </Button>
              </Form.Item>
            </Form>

            <p className="login-text">
              Already a user? <Link to="/login">Login now</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}
export default Register;