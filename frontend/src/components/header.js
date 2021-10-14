import React,{useEffect, useState} from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import "./header.css";

export default function Header(props) {

  return (
    <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="background-header">
      <Navbar.Brand href="#" style={{ fontSize: "28px" }}>
        SmartAssistant
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href={props.home} style={{ color: "white" }}>
            Trang chủ
          </Nav.Link>
          <Nav.Link href="#" style={{ color: "white" }}>
            Thống kê
          </Nav.Link>
          <Nav.Link href="#" style={{ color: "white" }}>
            Trợ giúp
          </Nav.Link>
        </Nav>
        <NavDropdown title={props.name} id="basic-nav-dropdown">
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Thông tin cá nhân</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Đổi mật khẩu</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#">Đăng xuất</NavDropdown.Item>
          </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}
