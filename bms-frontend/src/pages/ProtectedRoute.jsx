import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { message, Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setUser } from "../redux/userSlice";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector((state) => state.users.user);
  // Track the current authentication token in state to detect when user logs in/out
  // This allows useEffect to re-run when token changes and fetch the correct user data
  const [token, setToken] = useState(localStorage.getItem("token"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log({ user })
  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: () => navigate("/"),
    },
    {
      key: "user",
      label: user?.name || "",
      icon: <UserOutlined />,
      children: [
        {
          key: "profile",
          label: (
            <span
              onClick={() => {
                if (user?.role === "Admin") {
                  navigate("/admin");
                } else if (user?.role === "Partner") {
                  navigate("/partner");
                } else {
                  navigate("/profile");
                }
              }}
            >
              My Profile
            </span>
          ),
          icon: <ProfileOutlined />,
        },
        {
          key: "logout",
          label: (
            <Link
              to="/login"
              onClick={() => {
                // Remove token from localStorage
                localStorage.removeItem("token");
                // Update token state to trigger useEffect re-run and redirect to login
                setToken(null);
                // Clear user data from Redux store
                dispatch(setUser(null));
              }}
            >
              Log Out
            </Link>
          ),
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];

  const getValidUser = async () => {
    try {
      //Before fetching, turn loading on 
      dispatch(showLoading());

      const response = await getCurrentUser();
      console.log(response)

      dispatch(setUser(response.user)); // Store the user in the Redux store
      dispatch(hideLoading());
      // Hide Loader
    } catch (error) {
      dispatch(setUser(null));
      message.error(error.message);
    }
  };

  // // Listen for localStorage changes from other browser tabs/windows
  // // This handles scenarios where user logs in/out in another tab
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     // When storage changes in another tab (e.g., user logs in elsewhere),
  //     // update the token state in this component to keep it in sync
  //     const newToken = localStorage.getItem("token");
  //     setToken(newToken);
  //   };

  //   window.addEventListener('storage', handleStorageChange);
  //   // Cleanup: remove listener when component unmounts to prevent memory leaks
  //   return () => window.removeEventListener('storage', handleStorageChange);
  // }, []);

  // Re-fetch user data whenever token changes
  // This ensures the correct user is displayed when switching between accounts
  useEffect(() => {
    if (token) {
      // Token exists - fetch the user associated with this token from the backend
      getValidUser();
    } else {
      // No token - redirect to login page
      navigate("/login");
    }
  }, [token, navigate]);

  //Role-based authorization
  useEffect(() => {
    if (user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        message.error("You are not authorized to access this page");
        navigate("/");
      }
    }
  }, [user, allowedRoles]);

  if (!user) return null;

  return (
    user && (
      <>
        <Layout>
          <Header
            className="d-flex justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3 className="demo-logo text-white m-0" style={{ color: "white" }}>
              Book My Show
            </h3>
            <Menu theme="dark" mode="horizontal" items={navItems} />
          </Header>
          <div style={{ padding: 24, minHeight: 380, height: "90vh", background: "#fff" }}>
            {children}
          </div>
        </Layout>
      </>
    )
  );
}

export default ProtectedRoute;