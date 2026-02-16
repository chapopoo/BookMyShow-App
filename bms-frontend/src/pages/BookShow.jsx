import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { message, Card, Row, Col, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getShowById } from "../api/shows";
