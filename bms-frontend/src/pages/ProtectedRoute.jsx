import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { message, Layout, Menu, Tooltip, ConfigProvider, theme as antdTheme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { toggleTheme, initTheme } from "../redux/themeSlice";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector((state) => state.users.user);
  const themeMode = useSelector((state) => state.theme.mode);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Apply saved theme on first load
  useEffect(() => {
    dispatch(initTheme());
  }, []);

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

      dispatch(setUser(response.user)); // Store the user in the Redux store
      dispatch(hideLoading());// Hide Loader
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
  }, [user, allowedRoles, navigate]);

  if (!user) return null; // or a loading spinner, since we're fetching user data on mount

  return (
    user && (
      <>
        <ConfigProvider
          theme={{
            algorithm:
              themeMode === "dark"
                ? antdTheme.darkAlgorithm
                : antdTheme.defaultAlgorithm,
          }}
        >
          <Layout>
            <Header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--bg-navbar)",
                paddingInline: 24,
              }}
            >
              {/* Brand */}
              <h3 style={{ color: "#ffffff", margin: 0, fontWeight: 700, whiteSpace: "nowrap" }}>
                🎬 Book My Show
              </h3>

              {/* Nav + Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  items={navItems}
                  style={{ background: "transparent", borderBottom: "none", minWidth: 200 }}
                />

                {/* Sun / Moon toggle */}
                <Tooltip title={themeMode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                  <button
                    onClick={() => dispatch(toggleTheme())}
                    style={{
                      background: "var(--toggle-bg)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--toggle-color)",
                    }}
                  >
                  {themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
                </button>
              </Tooltip>
            </div>
          </Header>

          {/* Content */}
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 64px)",
              background: "var(--bg-page)",
              transition: "background 0.3s ease",
            }}
          >
            {children}
          </div>
        </Layout>
      </ConfigProvider >
      </>
    )
  );
}

export default ProtectedRoute;