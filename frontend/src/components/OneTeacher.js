import React, { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import axios from "axios";
import config from "../config/config";
import DefaultInfoAvt from "../assert/default_avt.png";
import "./OneUser.css";

export default function OneTeacher(props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };
  const handleShowView = () => {
    setShowView(true);
  };
  const handleShowDelete = () => {
    setShowDelete(true);
  };
  const handleCloseModal = () => {
    setShowDelete(false);
    setShowView(false);
  };
  const handleDeleteUser = () => {
      let user={id: props.item.id};
    axios
      .post(`${config.SERVER_URI}/admin/deleteuser`, user)
      .then((response) => {
        console.log(response);
        setShowDelete(false);
        refreshPage();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="one-user-item">
        <div className="top">
            <div className="left">
                {props.item.avatar !=="" ? <img src={props.item.avatar} alt="ảnh đại diện"></img> : <img src={DefaultInfoAvt} alt="ảnh đại diện"></img>}
            </div>
            <div className="right">
                <p>
                    <span className="title-name">Họ và tên: </span>
                    {props.item.name}
                </p>
                <p>
                    <span className="title-name">Tên đăng nhập: </span>
                    {props.item.username}
                </p>
                <p>
                    <span className="title-name">Vai trò: </span>
                    Giáo viên
                </p>
                <p>
                    <span className="title-name">Số điện thoại: </span>
                    {props.item.phone}
                </p>
                <p>
                    <span className="title-name">Email: </span>
                    {props.item.email}
                </p>
                <p>
                    <span className="title-name">Giới tính: </span>
                    {props.item.gender}
                </p>
                <p>
                    <span className="title-name">Tuổi: </span>
                    {props.item.age}
                </p>
                <p>
                    <span className="title-name">Cấp độ: </span>
                    {props.item.level}
                </p>
                <p>
                    <span className="title-name">Chuyên môn: </span>
                    {props.item.subject}
                </p>
                <p>
                    <span className="title-name">Số lớp đang dạy: </span>
                    {props.item.classes}
                </p>
            </div>
            
        </div>
      <div className="view-delete">
        <Button
          variant="success"
          type="submit"
          className=""
          onClick={handleShowView}
          style={{marginRight:"10px"}}
        >
          Xem chi tiết
        </Button>
        <Button
          variant="danger"
          //   color="secondary"
          className=""
          size="small"
          onClick={handleShowDelete}
          style={{marginLeft:"10px"}}
        >
          Xóa tài khoản
        </Button>
      </div>
      {/* View */}
      <Modal show={showView} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Giáo viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="user-content">
                <div className="left">
                {props.item.avatar !=="" ? <img src={props.item.avatar} alt="ảnh đại diện"></img> : <img src={DefaultInfoAvt} alt="ảnh đại diện"></img>}
                </div>
                <div className="right">
                    <Form>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Họ và tên
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.name}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Tên đăng nhập
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.username}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Vai trò
                                </Form.Label>
                                <Form.Label column lg={8}>
                                Học sinh
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Số điện thoại
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.phone}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Email
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.email}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Giới tính
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.gender}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Tuổi
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.age}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Cấp độ
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.level}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Chuyên môn
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.subject}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                                Số lớp đang dạy
                                </Form.Label>
                                <Form.Label column lg={8}>
                                {props.item.classes}
                                </Form.Label>
                            </Form.Row>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete */}
      <Modal show={showDelete} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>
            Bạn muốn xóa tài khoản {props.item.username}?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
