import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import RouterList from "../router/routerList";
import BackgroundWelcomeImg from "../assert/welcome.jpg";
import "./Welcome.css";

export default function Welcome() {
  const history = useHistory();
  const [showErrorParam, setShowErrorParam] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [showErrorUser, setShowErrorUser] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const handleChangeUsername = (e) => {
    user.username = e.target.value;
    setUser({ ...user });
  };
  const handleChangePassword = (e) => {
    user.password = e.target.value;
    setUser({ ...user });
  };
  const handleSignin = () => {
    axios
      .post(`${config.SERVER_URI}/login`, user)
      .then((response) => {
        // console.log(response.data);
        if (response.data.code ==="1002") {
          setShowErrorUser(false);
          setShowErrorPassword(false);
          setShowErrorParam(true);
        } else if (response.data.code === "9995") {
          setShowErrorUser(true);
          setShowErrorPassword(false);
          setShowErrorParam(false);
        } else if (response.data.code === "9998") {
          setShowErrorUser(false);
          setShowErrorPassword(true);
          setShowErrorParam(false);
        } else {
          setShowErrorPassword(false);
          setShowErrorUser(false);
          setShowErrorParam(false);
          localStorage.setItem("user_id", response.data.data.id);
          if (response.data.data.role === 1) {
            localStorage.setItem("student_name", response.data.data.name);
            localStorage.setItem(
              "student_username",
              response.data.data.username
            );
            localStorage.setItem("student_id", response.data.data.id);
            localStorage.setItem("student_avt", response.data.data.avatar);
            history.push(RouterList.STUDENT_HOME);
          } else if(response.data.data.role === 0) {
            localStorage.setItem("teacher_name", response.data.data.name);
            localStorage.setItem(
              "teacher_username",
              response.data.data.username
            );
            localStorage.setItem("teacher_id", response.data.data.id);
            history.push(RouterList.TEACHER_HOME);
          }else{
            localStorage.setItem(
              "admin_username",
              response.data.data.username
            );
            localStorage.setItem("admin_id", response.data.data.id);
            history.push(RouterList.ADMIN_HOME);
          }
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  return (
    <div className="home-container">
      {/* <div className="left-welcome"> */}
        <img src={BackgroundWelcomeImg} alt="bg-welcome"></img>
      {/* </div> */}
      <div className="blur-bg">
        <div id="login-container">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="label">Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={user.username}
                onChange={handleChangeUsername}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="label">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={user.password}
                onChange={handleChangePassword}
              />
            </Form.Group>
          </Form>
          <div className="text-signup">
            {showErrorParam && (
              <div className="text-error">
                Vui lòng nhập đầy đủ thông tin bắt buộc
              </div>
            )}
            {showErrorPassword && (
              <div className="text-error">Mật khẩu không chính xác</div>
            )}
            {showErrorUser && (
              <div className="text-error">Tài khoản không tồn tại</div>
            )}
            <div style={{ fontSize: "20px" }}>
              Chưa có tài khoản? Đăng ký ngay
            </div>
            <div className="link-to-signup">
              <Link to={RouterList.SIGNUP_STUDENT} style={{ color: "#1e7e34" }}>
                Học sinh/
              </Link>
              <Link to={RouterList.SIGNUP_TEACHER} style={{ color: "#6235cc" }}>
                Giáo viên
              </Link>
            </div>
            <Button
              variant="info"
              type="submit"
              className="btn-signin"
              onClick={handleSignin}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
