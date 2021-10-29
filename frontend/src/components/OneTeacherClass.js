import React, { useState } from "react";
import { Modal, Form, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import config from "../config/config";
import "./OneClass.css";

export default function OneTeacherClass(props) {
  const linktoclass = "/teacher_classroom/" + props.class.id;
  let flag = true;
  if (props.class.is_learning) {
    flag = false;
  } else {
    flag = true;
  }
  const [showDelete, setShowDelete] = useState(false);
  const [showLearning, setShowLearning] = useState(flag);
  const itemClass = {
    username: localStorage.getItem("teacher_username"),
    id: props.class.id,
  };
  const refreshPage = () => {
    window.location.reload();
  };
  const handleShowDelete = () => {
    setShowDelete(true);
  };
  const handleCloseModal = () => {
    setShowDelete(false);
  };
  const handleDeleteClass = () => {
    axios
      .post(`${config.SERVER_URI}/teacher/deleteclass`, itemClass)
      .then((response) => {
        console.log(response);
        setShowDelete(false);
        refreshPage();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleLearning = () => {
    axios
      .post(`${config.SERVER_URI}/teacher/startlearning`, itemClass)
      .then((response) => {
        if (showLearning) {
          setShowLearning(false);
        } else {
          setShowLearning(true);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  return (
    <div className="one-class-item">
      <div className="classname">
        <Link to={linktoclass}>{props.class.name}</Link>
      </div>

      <p>
        <span className="title-name">Mô tả: </span>
        {props.class.description}
      </p>
      <p>
        <span className="title-name">Mã lớp: </span>
        {props.class.code}
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

      <div className="start-delete">
        {showLearning && (
          <Button
            variant="success"
            type="submit"
            className=""
            onClick={handleLearning}
          >
            Bắt đầu học
          </Button>
        )}
        {!showLearning && (
          <Button
            variant="danger"
            type="submit"
            className=""
            onClick={handleLearning}
          >
            Kết thúc học
          </Button>
        )}

        <Button
          variant="outlined"
          //   color="secondary"
          className=""
          size="small"
          onClick={handleShowDelete}
        >
          <DeleteIcon style={{ color: "#dc3545", fontSize: 45 }} />
        </Button>
      </div>
      {/* Delete */}
      <Modal show={showDelete} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>
            Bạn muốn xóa lớp {props.class.name}?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleDeleteClass}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
