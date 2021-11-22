import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import config from "../config/config";
import "./OneNotification.css";
import { formatHoursMinus, formatDate } from "../utils/format";

export default function OneNotification(props) {
  const time = formatHoursMinus(props.item.timestamp);
  const date = formatDate(props.item.timestamp);
  const [showViewJoinClass, setShowViewJoinClass] = useState(false);
  // const [showBottomBtn, setShowBottomBtn] = useState(false);

  // if(props.item.is_waiting === 1){
  //   setShowBottomBtn(true);
  // }else{
  //   setShowBottomBtn(false);
  // }

  const handleViewJoinClass = () => {
    setShowViewJoinClass(true);
  };
  const handleClose = () => {
    setShowViewJoinClass(false);
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
      {/* view */}
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
      {/* <div className="username">{props.item.student}</div>
      {props.item.time_delta && (
        <div className="message"> vào lớp muộn {props.item.time_delta} phút</div>
      )}
      {!props.item.time_delta && <div className="message"> không tập trung</div>} */}
    </div>
  );
}
