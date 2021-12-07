import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./OneClass.css";

export default function OneAdminClass(props) {
  const [showViewClass, setShowViewClass] = useState(false);

  const handleCloseModal = () => {
    setShowViewClass(false);
  };
  const handleShowViewClass = () => {
    setShowViewClass(true);
  };
  return (
    <div className="one-class-item">
      <div className="classname">
        <Link to="#">{props.class.name}</Link>
      </div>
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
        <div className="view-out">
          <Button
            variant="success"
            //   color="secondary"
            // className=""
            // size="small"
            onClick={handleShowViewClass}
            style={{ textAlign: "center" }}
          >
            {/* <VisibilityIcon
              style={{ color: "rgb(94 132 220)", fontSize: 45 }}
            /> */}
            Xem chi tiết
          </Button>
        </div>
      </div>
      {/* View */}
      <Modal show={showViewClass} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Tên lớp học
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.class.name}
                </Form.Label>
              </Form.Row>
            </Form.Group>

            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Giáo viên
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.class.teacher}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Mô tả
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.class.description}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Loại lớp
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.class.type}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Lịch học
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.class.schedule}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Thời lượng
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.class.duration} phút
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
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
