import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import config from "../config/config";
import "./OneNotification.css";
import { formatHoursMinus, formatDate } from "../utils/format";

export default function OneNotification(props) {
  const time = formatHoursMinus(props.item.timestamp);
  const date = formatDate(props.item.timestamp);
  const [showViewJoinClass, setShowViewJoinClass] = useState(false);
  const [showViewMonitorFault, setShowViewMonitorFault] = useState(false);
  // const [showBottomBtn, setShowBottomBtn] = useState(false);

  // if(props.item.is_waiting === 1){
  //   setShowBottomBtn(true);
  // }else{
  //   setShowBottomBtn(false);
  // }

  const handleViewJoinClass = () => {
    setShowViewJoinClass(true);
  };
  const handleViewPosibleFaultMonitor = () => {
    setShowViewMonitorFault(true);
  };
  const handleClose = () => {
    setShowViewJoinClass(false);
    setShowViewMonitorFault(false);
  };
  const handleRefuseJoinClass = () => {
    setShowViewJoinClass(false);
    let itemRefuse = {
      notification_id: props.item.id,
    };
    axios
      .post(`${config.SERVER_URI}/teacher/refuseJoinClass`, itemRefuse)
      .then((response) => {
        console.log(response);
        // setShowBottomBtn(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleAcceptJoinClass = () => {
    setShowViewJoinClass(false);
    let itemAccept = {
      student_id: props.item.student_id,
      class_id: props.item.class_id,
      notification_id: props.item.id,
    };
    axios
      .post(`${config.SERVER_URI}/teacher/acceptJoinClass`, itemAccept)
      .then((response) => {
        console.log(response);
        // setShowBottomBtn(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleAcceptFault = () => {
    setShowViewMonitorFault(false);
    let itemAccept = {
      student_id: props.item.student_id,
      class_id: props.item.class_id,
      notification_id: props.item.id,
    };
    axios
      .post(`${config.SERVER_URI}/teacher/acceptFaultMonitor`, itemAccept)
      .then((response) => {
        console.log(response);
        // setShowBottomBtn(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  return (
    <div className="one-noti-item">
      <div className="timestamp">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
      {props.item.type === 0 && (
        <div className="content">
          <div className="top-content">
            <div className="name">{props.item.student_name}</div>
            <div className="message"> muốn tham gia lớp học.</div>
          </div>
          {props.item.is_waiting === 1 && (
            <div className="bottom-content">
              {/* <Button
                variant="outline-danger"
                type="submit"
                className=""
                onClick={handleRefuseJoinClass}
              >
                Bỏ qua
              </Button>
              <Button
                variant="outline-info"
                type="submit"
                className=""
                onClick={handleAcceptJoinClass}
              >
                Chấp nhận
              </Button> */}
              <Button
                variant="outline-secondary"
                type="submit"
                className=""
                onClick={handleViewJoinClass}
              >
                Chi tiết
              </Button>
            </div>
          )}
        </div>
      )}
      {props.item.type === 1 && (
        <div className="content">
          <div className="top-content">
            <div className="name">{props.item.student_name}</div>
            <div className="message"> vào lớp muộn {props.item.time_late}</div>
          </div>
        </div>
      )}
      {props.item.type === 2 && (
        <div className="content">
          <div className="top-content">
            <div className="name">{props.item.student_name}</div>
            <div className="message"> hiện đang không chú ý!</div>
          </div>
          {props.item.is_waiting === 1 && (
            <div className="bottom-content">
              <Button
                variant="outline-secondary"
                type="submit"
                className=""
                onClick={handleViewPosibleFaultMonitor}
              >
                Chi tiết
              </Button>
            </div>
          )}
        </div>
      )}
      {/* view join class*/}
      <Modal show={showViewJoinClass} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu tham gia lớp học</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Họ và tên
                </Form.Label>
                <Form.Label column lg={6}>
                  {props.item.student_name}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Số điện thoại
                </Form.Label>
                <Form.Label column lg={6}>
                  {props.item.student_phone}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Email
                </Form.Label>
                <Form.Label column lg={6}>
                  {props.item.student_email}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Tuổi
                </Form.Label>
                <Form.Label column lg={6}>
                  {props.item.student_age}
                </Form.Label>
              </Form.Row>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRefuseJoinClass}>
            Bỏ qua
          </Button>
          <Button variant="info" onClick={handleAcceptJoinClass}>
            Cho phép
          </Button>
        </Modal.Footer>
      </Modal>
      {/* view posible monitor fault*/}
      <Modal show={showViewMonitorFault} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cảnh báo mất tập trung</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Họ và tên
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.item.student_name}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                  Tên tài khoản
                </Form.Label>
                <Form.Label column lg={8}>
                  {props.item.student_username}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold", textAlign: "center" }}>
                Ảnh minh chứng
              </Form.Label>
              <div className="imgs-posible-fault-monitor">
                <Row>
                  {props.item.imgs &&
                    props.item.imgs.map((item) => (
                      <Col xs={4} key={props.item.imgs.indexOf(item)}>
                        <img
                          className="img-posible-fault-monitor"
                          src={item}
                          alt="anh minh chung"
                        ></img>
                      </Col>
                    ))}
                </Row>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Bỏ qua
          </Button>
          <Button variant="info" onClick={handleAcceptFault}>
            Xác nhận lỗi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
