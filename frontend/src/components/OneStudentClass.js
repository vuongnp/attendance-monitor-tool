import React, { useState } from "react";
import { Modal, Form, Col, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import config from "../config/config";
import "./OneClass.css";

export default function OneStudentClass(props) {
  const [showOutClass, setShowOutClass] = useState(false);
  const [showViewClass, setShowViewClass] = useState(false);
  //   const [showLearning, setShowLearning] = useState(flag);
  const itemOutClass = {
    student_id: localStorage.getItem("student_id"),
    class_id: props.class.id,
  };
  const refreshPage = () => {
    window.location.reload();
  };
  const handleShowOutClass = () => {
    setShowOutClass(true);
  };
  const handleCloseModal = () => {
    setShowOutClass(false);
    setShowViewClass(false);
  };
  const handleShowViewClass = () =>{
    setShowViewClass(true);
  }
  const handleOutClass = () => {
    axios
      .post(`${config.SERVER_URI}/student/outclass`, itemOutClass)
      .then((response) => {
        console.log(response);
        setShowOutClass(false);
        refreshPage();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleJoinLearn = () => {
    alert("AAAAAAA");
  };
  return (
    <div className="one-class-item">
      <h3 className="name-class">{props.class.name}</h3>
      <p>
        <span className="title-name">Giáo viên: </span>
        {props.class.teacher}
      </p>
      <p>
        <span className="title-name">Mô tả: </span>
        {props.class.description}
      </p>
      <p>
        <span className="title-name">Loại lớp: </span>
        {props.class.type}
      </p>
      <p>
        <span className="title-name">Lịch học: </span>
        {props.class.schedule}
      </p>
      <p>
        <span className="title-name">Thời lượng: </span>
        {props.class.duration} phút
      </p>
      <p>
        <span className="title-name">Số học sinh: </span>
        {props.class.students.length}
      </p>

      <div className="learn-view-out">
        <Button
          variant="success"
          type="submit"
          className=""
          onClick={handleJoinLearn}
        >
          Vào học
        </Button>
        <div className="view-out">
          <Button
            variant="outlined"
            //   color="secondary"
            className=""
            size="small"
              onClick={handleShowViewClass}
          >
            <VisibilityIcon style={{ color: "rgb(94 132 220)", fontSize: 45 }} />
          </Button>
          <Button
            variant="outlined"
            //   color="secondary"
            className=""
            size="small"
            onClick={handleShowOutClass}
          >
            <LogoutIcon style={{ color: "#dc3545", fontSize: 45 }} />
          </Button>
        </div>
      </div>
      {/* OutClass */}
      <Modal show={showOutClass} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rời lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>
            Bạn muốn rời khỏi lớp {props.class.name}?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleOutClass}>
            Rời lớp
          </Button>
        </Modal.Footer>
      </Modal>
      {/* View */}
      <Modal show={showViewClass} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4} style={{"fontWeight":"bold"}}>
                      Tên lớp học
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.name}
                    </Form.Label>
                  </Form.Row>
                </Form.Group>

                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4} style={{"fontWeight":"bold"}}>
                      Giáo viên
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.teacher}
                    </Form.Label>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4}  style={{"fontWeight":"bold"}}>
                      Mô tả
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.description}
                    </Form.Label>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4}  style={{"fontWeight":"bold"}}>
                      Loại lớp
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.type}
                    </Form.Label>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4} style={{"fontWeight":"bold"}}>
                      Lịch học
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.schedule}
                    </Form.Label>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4} style={{"fontWeight":"bold"}}>
                      Thời lượng
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.duration} phút
                    </Form.Label>
                  </Form.Row>
                </Form.Group>
                <Form.Group>
                  <Form.Row>
                    <Form.Label column lg={4} style={{"fontWeight":"bold"}}>
                      Số học sinh
                    </Form.Label>
                    <Form.Label column lg={8}>
                      {props.class.students.length}
                    </Form.Label>
                  </Form.Row>
                </Form.Group>
              </Form>
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
