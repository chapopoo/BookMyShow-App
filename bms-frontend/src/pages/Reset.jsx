import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../api/users";
import movieImg from "../assets/Img1.jpg";
import "../auth.css";

function Reset() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const location = useLocation();

    // email passed from Forget page via navigate state
    const email = location.state?.email || "";

    const onFinish = async (values) => {
        try {
            const response = await resetPassword({ email, ...values });
            if (response.success) {
                messageApi.success("Password reset successfully!");
                navigate("/login");
            } else {
                messageApi.error(response.message || "Something went wrong");
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
                        <p>Enter your OTP and set a strong new password</p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="right-panel">
                    <div className="register-card">

                        <h2>Reset Password</h2>
                        <p className="card-sub">Check your inbox for the OTP we sent you</p>

                        <Form onFinish={onFinish} layout="vertical" size="large">

                            <Form.Item
                                label="OTP"
                                name="otp"
                                rules={[
                                    { required: true, message: "OTP is required" },
                                    { len: 6, message: "OTP must be 6 digits" },
                                    { pattern: /^\d+$/, message: "OTP must be numeric" },
                                ]}
                            >
                                <Input placeholder="Enter the 6-digit OTP" maxLength={6} />
                            </Form.Item>

                            <Form.Item
                                label="New Password"
                                name="password"
                                rules={[
                                    { required: true, message: "Password is required" },
                                    { min: 6, message: "Minimum 6 characters" },
                                ]}
                            >
                                <Input.Password placeholder="Enter new password" />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "Please confirm your password" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Passwords do not match!"));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Repeat your new password" />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 8 }}>
                                <Button className="custom-btn" block htmlType="submit">
                                    Reset Password
                                </Button>
                            </Form.Item>

                        </Form>

                        <p className="login-text">
                            <Link to="/login">Back to Login</Link>
                        </p>

                    </div>
                </div>

            </div>
        </>
    );
}

export default Reset;