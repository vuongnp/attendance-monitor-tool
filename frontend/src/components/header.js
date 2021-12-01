import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Form, Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import config from "../config/config";
import RouterList from "../router/routerList";
import "./header.css";

export default function Header(props) {
  // console.log(window.location.origin);
  // console.log(props.home);
  const link_to_home = window.location.origin + "/" + props.home;
  const link_to_stat_admin = window.location.origin + RouterList.ADMIN_STATISTIC;
  const link_to_stat_teacher = window.location.origin + RouterList.TEACHER_STATISTIC;
  const link_to_setting_mode = window.location.origin + RouterList.SETTING_MODE;
  const history = useHistory();
  const [showLogout, setShowLogout] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showErrorParam, setShowErrorParam] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [showOldPass, setShowOldPass] = useState(true);
  const [showNewPass, setShowNewPass] = useState(true);
  const [itemChangePass, setItemChangePass] = useState({
    user_id: localStorage.getItem("user_id"),
    oldpassword: "",
    newpassword: "",
  });
  const toggleShowHideOldPass = () => {
    setShowOldPass(!showOldPass);
  };
  const toggleShowHideNewPass = () => {
    setShowNewPass(!showNewPass);
  };
  const handleChangePasssword = () => {
    setShowChangePassword(true);
  };
  const handleLogout = () => {
    setShowLogout(true);
  };
  const handleClose = () => {
    setShowLogout(false);
    setShowChangePassword(false);
  };
  const handleChangeOldPassword = (e) => {
    itemChangePass.oldpassword = e.target.value;
    setItemChangePass({ ...itemChangePass });
  };
  const handleChangeNewPassword = (e) => {
    itemChangePass.newpassword = e.target.value;
    setItemChangePass({ ...itemChangePass });
  };
  const handleOKChangePassword = () => {
    axios
      .post(`${config.SERVER_URI}/auth/changepassword`, itemChangePass)
      .then((response) => {
        console.log(response);
        if (response.data.code === "1002") {
          setShowErrorPassword(false);
          setShowErrorParam(true);
        } else if (response.data.code === "9998") {
          setShowErrorParam(false);
          setShowErrorPassword(true);
        } else {
          setShowErrorParam(false);
          setShowErrorPassword(false);
          history.push(RouterList.WELCOME);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleGetInfo = () => {
    if (props.home === "teacher_home") {
      history.push(RouterList.TEACHER_INFO);
    } else {
      history.push(RouterList.STUDENT_INFO);
    }
  };
  const handleOKLogout = () => {
    window.localStorage.clear();
    history.push(RouterList.WELCOME);
  };
  return (
    <Navbar
      expand="lg"
      // bg="dark"
      // variant="dark"
      fixed="top"
      className="background-header"
    >
      <Navbar.Brand href="#" style={{ fontSize: "28px", color: "white" }}>
        SmartAssistant
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href={link_to_home} style={{ color: "white" }}>
            Trang chủ
          </Nav.Link>
          {props.home === "teacher_home" && (
            <Nav.Link href={link_to_stat_teacher} style={{ color: "white" }}>
              Thống kê
            </Nav.Link>
          )}
          {/* {props.home === "admin_home" && (
            <Nav.Link href={link_to_stat_admin} style={{ color: "white" }}>
              Thống kê
            </Nav.Link>
          )} */}
          {/* {props.home === "admin_home" && (
            <Nav.Link href="#" style={{ color: "white" }}>
              Quản lý các chế độ
            </Nav.Link>
          )} */}
          {/* <Nav.Link href="#" style={{ color: "white" }}>
            Trợ giúp
          </Nav.Link> */}
        </Nav>
        {props.home !== "admin_home" && (
          <NavDropdown title={props.name} id="basic-nav-dropdown">
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={handleGetInfo}>
              Thông tin cá nhân
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={handleChangePasssword}>
              Đổi mật khẩu
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={handleLogout}>
              Đăng xuất
            </NavDropdown.Item>
          </NavDropdown>
        )}
        {props.home === "admin_home" && (
          <NavDropdown title={props.name} id="basic-nav-dropdown">
            <NavDropdown.Divider />
            <NavDropdown.Item href={link_to_stat_admin}>
              Xem thống kê
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href={link_to_setting_mode}>
              Quản lý các chế độ
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={handleLogout}>
              Đăng xuất
            </NavDropdown.Item>
          </NavDropdown>
        )}
      </Navbar.Collapse>
      <Modal show={showLogout} onHide={handleClose}>
        {/* <Modal.Header closeButton>
          <Modal.Title>Xóa xe</Modal.Title>
        </Modal.Header> */}
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>Đăng xuất?</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="info" onClick={handleOKLogout}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Change password */}
      <Modal show={showChangePassword} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <div className="item-change-pass">
                <Form.Control
                  type={showOldPass ? "password" : "text"}
                  placeholder="Nhập mật khẩu hiện tại"
                  value={itemChangePass.oldpassword}
                  onChange={handleChangeOldPassword}
                  className="input-change-pass"
                />
                {showOldPass && (
                  <VisibilityIcon
                    style={{
                      color: "#808080a1",
                      fontSize: 40,
                      cursor: "pointer",
                    }}
                    onClick={toggleShowHideOldPass}
                  />
                )}
                {!showOldPass && (
                  <VisibilityOffIcon
                    style={{
                      color: "#808080a1",
                      fontSize: 40,
                      cursor: "pointer",
                    }}
                    onClick={toggleShowHideOldPass}
                  />
                )}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Mật khẩu mới</Form.Label>
              <div className="item-change-pass">
                <Form.Control
                  type={showNewPass ? "password" : "text"}
                  placeholder="Nhập mật khẩu mới"
                  value={itemChangePass.newpassword}
                  onChange={handleChangeNewPassword}
                  className="input-change-pass"
                />
                {showNewPass && (
                  <VisibilityIcon
                    style={{
                      color: "#808080a1",
                      fontSize: 40,
                      cursor: "pointer",
                    }}
                    onClick={toggleShowHideNewPass}
                  />
                )}
                {!showNewPass && (
                  <VisibilityOffIcon
                    style={{
                      color: "#808080a1",
                      fontSize: 40,
                      cursor: "pointer",
                    }}
                    onClick={toggleShowHideNewPass}
                  />
                )}
              </div>
            </Form.Group>
          </Form>
          {showErrorParam && (
            <div className="text-error" style={{ textAlign: "center" }}>
              Vui lòng nhập đầy đủ thông tin
            </div>
          )}
          {showErrorPassword && (
            <div className="text-error" style={{ textAlign: "center" }}>
              Mật khẩu không chính xác
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="info" onClick={handleOKChangePassword}>
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
}
