import React from "react";
import { Button, Form, Input, message, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../api/users";

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
      if (response.userPresentError) {
        messageApi.error("Email is already taken!!")
      } else {
        messageApi.error("Something went wrong!")
        console.log("error", err)
      }
    }
  }
  return (
    <>
      {contextHolder}
      <header className="App-header">
        <main className="main-area mw-500 text-center px-3">
          <section className="left-section">
            <h1>Register to BookMyShow</h1>
          </section>

          <section className="right-section">
            <Form onFinish={onFinishRegistrationForm} layout="vertical">
              <Form.Item
                label="Name"
                htmlFor="name"
                name="name"
                className="d-block"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"

                ></Input>
              </Form.Item>

              <Form.Item
                label="Email"
                htmlFor="email"
                name="email"
                className="d-block"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your Email"

                ></Input>
              </Form.Item>

              <Form.Item
                label="Password"
                htmlFor="password"
                name="password"
                className="d-block"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"

                ></Input>
              </Form.Item>

              <Form.Item
                label="Register as an Admin?"
                htmlFor="isAdmin"
                name="isAdmin"
                className="d-block text-center"
                rules={[{ required: true, message: "Please select an option!" }]}
              >
                <div className="d-flex justify-content-start">

                  <Radio.Group
                    name="radiogroup"
                    className="flex-start"
                  >
                    <Radio value={'Admin'}>Yes</Radio>
                    <Radio value={'user'}>No</Radio>
                  </Radio.Group>
                </div>
              </Form.Item>

              <Form.Item
                label="Register as an Partner?"
                htmlFor="isPartner"
                name="isPartner"
                className="d-block text-center"
                // initialValue={false}
                rules={[{ required: true, message: "Please select an option!" }]}
              >
                <div className="d-flex justify-content-start">

                  <Radio.Group
                    name="radiogroup"
                    className="flex-start"
                  >
                    <Radio value={'Partner'}>Yes</Radio>
                    <Radio value={'user'}>No</Radio>
                  </Radio.Group>
                </div>
              </Form.Item>


              <Form.Item className="d-block">
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
            <div>
              <p>
                Already a user? <Link to="/login">Login now</Link>
              </p>
            </div>
          </section>
        </main>
      </header>
    </>
  );
}

export default Register;