import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forgetPassword } from "../api/users";
import movieImg from "../assets/Img1.jpg";
import "../auth.css";

function Forget() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await forgetPassword(values);
            if (response.success) {
                messageApi.success(response.message);
                navigate("/reset", { state: { email: values.email } });
            } else {
                messageApi.error(response.message);
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
                        <p>We'll send an OTP to your registered email</p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="right-panel">
                    <div className="register-card">

                        <h2>Forgot Password?</h2>
                        <p className="card-sub">No worries — enter your email and we'll send you a reset OTP</p>

                        <Form onFinish={onFinish} layout="vertical" size="large">

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Email is required" },
                                    { type: "email", message: "Enter a valid email" },
                                ]}
                            >
                                <Input placeholder="Enter your registered email" />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 8 }}>
                                <Button className="custom-btn" block htmlType="submit">
                                    Send OTP
                                </Button>
                            </Form.Item>

                        </Form>

                        <p className="login-text">
                            Remember your password? <Link to="/login">Back to Login</Link>
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

export default Forget;