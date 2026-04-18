import React, { useEffect, useState } from 'react'
import { Button, Col, Row, message, Tag, Empty } from "antd";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getAllBookings } from "../api/bookings";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  TagOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import "../profile.css";

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Get initials from user name for avatar
  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const roleColor = {
    Admin: "red",
    Partner: "blue",
    User: "cyan",
  };

  return (
    <>
      <div className="profile-wrap">

        {/* ── User info card ── */}
        {user && (
          <div className="profile-user-card">
            <div className="profile-avatar">{getInitials(user.name)}</div>
            <div className="profile-user-info">
              <h2 className="profile-name">{user.name}</h2>
              <div className="profile-meta-row">
                <span className="profile-meta-item">
                  <MailOutlined /> {user.email}
                </span>
                <Tag color={roleColor[user.role] || "default"} className="profile-role-tag">
                  {user.role}
                </Tag>
              </div>
            </div>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-number">{bookings.length}</span>
                <span className="profile-stat-label">Total Bookings</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="profile-stat-number">
                  Rs.{bookings.reduce((acc, b) => acc + b.seats.length * b.show.ticketPrice, 0).toLocaleString()}
                </span>
                <span className="profile-stat-label">Total Spent</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings section heading ── */}
        {bookings.length > 0 && (
          <div className="profile-section-heading">
            <h3 className="profile-section-title">My Bookings</h3>
            <span className="profile-section-sub">{bookings.length} ticket{bookings.length !== 1 ? 's' : ''} booked</span>
          </div>
        )}

        {/* ── Bookings grid ── */}
        {bookings.length > 0 ? (
          <Row gutter={[20, 20]}>
            {bookings.map((booking) => (
              <Col key={booking._id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <div className="booking-card">

                  {/* Poster */}
                  <div className="booking-poster-wrap">
                    <img
                      src={booking.show.movie.poster}
                      alt={booking.show.movie.title}
                      className="booking-poster"
                    />
                  </div>

                  {/* Details */}
                  <div className="booking-details">
                    <h4 className="booking-movie-title">{booking.show.movie.title}</h4>

                    <div className="booking-info-row">
                      <EnvironmentOutlined className="booking-icon" />
                      <span>{booking.show.theatre.name}</span>
                    </div>

                    <div className="booking-info-row">
                      <CalendarOutlined className="booking-icon" />
                      <span>
                        {moment(booking.show.date).format("MMM Do YYYY")}
                        {" · "}
                        {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                      </span>
                    </div>

                    <div className="booking-info-row">
                      <TagOutlined className="booking-icon" />
                      <span className="booking-seats">{booking.seats.join(", ")}</span>
                    </div>

                    {/* Ticket footer */}
                    <div className="booking-footer">
                      <div className="booking-footer-left">
                        <CreditCardOutlined className="booking-icon" />
                        <span className="booking-txn">#{booking.transactionId?.slice(-8)}</span>
                      </div>
                      <span className="booking-amount">
                        Rs.{(booking.seats.length * booking.show.ticketPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>
              </Col>
            ))}
          </Row>
        ) : (
          /* ── Empty state ── */
          <div className="profile-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="profile-empty-text">
                  You haven't booked any show yet!
                </span>
              }
            >
              <Link to="/">
                <Button className="custom-btn">Start Booking</Button>
              </Link>
            </Empty>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;