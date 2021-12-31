import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import config from "../config/config";
import "./OneNotification.css";
import { socket } from "../App";
import { formatHoursMinusSeconds, formatHoursMinus, formatDate } from "../utils/format";

export default function OneNotification(props) {
  const time = formatHoursMinus(props.item.timestamp);
  const date = formatDate(props.item.timestamp);
  const [showViewJoinClass, setShowViewJoinClass] = useState(false);
  const [showViewMonitorFault, setShowViewMonitorFault] = useState(false);
  const [showReportAttendance, setShowReportAttendance] = useState(false);
  // const [showBottomBtn, setShowBottomBtn] = useState(false);

  // if(props.item.is_waiting === 1){
  //   setShowBottomBtn(true);
  // }else{
  //   setShowBottomBtn(false);
  // }

  const handleViewJoinClass = () => {
    setShowViewJoinClass(true);
  };
  const handleViewReportAttendance = () => {
    setShowReportAttendance(true);
  };
  const handleViewPosibleFaultMonitor = () => {
    setShowViewMonitorFault(true);
  };
  const handleClose = () => {
    setShowViewJoinClass(false);
    setShowViewMonitorFault(false);
    setShowReportAttendance(false);
  };
  const handleRefuseNotification = () => {
    setShowViewMonitorFault(false);
    setShowViewJoinClass(false);
    let itemRefuse = {
      notification_id: props.item.id,
    };
    axios
      .post(`${config.SERVER_URI}/teacher/refuseNotification`, itemRefuse)
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
  const handleRefuseAttendance = () => {
    setShowReportAttendance(false);
    socket.emit("refuse_attendance", {
      data: {
        student_id: props.item.student_id,
        notification_id: props.item.id,
      },
    });
    // let itemRefuse = {
    //   student_id: props.item.student_id,
    //   notification_id: props.item.id,
    // };
    // axios
    //   .post(`${config.SERVER_URI}/teacher/refuseReportAttendance`, itemRefuse)
    //   .then((response) => {
    //     console.log(response);
    //     // setShowBottomBtn(false);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error!", error);
    //   });
    // socket.emit("refuse_attendance", { data: props.item.student_id });
  };
  const handleAcceptAttendace = () => {
    setShowReportAttendance(false);
    socket.emit("accept_attendance", {
      data: {
        class_id: props.item.class_id,
        student_id: props.item.student_id,
        time_late: props.item.time_late,
        time_to_late: props.item.time_to_late,
        notification_id: props.item.id,
      },
    });
    // let itemAccept = {
    //   class_id: props.item.class_id,
    //   student_id: props.item.student_id,
    //   time_late: props.item.time_late,
    //   time_to_late: props.item.time_to_late,
    //   notification_id: props.item.id,
    // };
    // axios
    //   .post(`${config.SERVER_URI}/teacher/acceptReportAttendance`, itemAccept)
    //   .then((response) => {
    //     console.log(response);
    //     // setShowBottomBtn(false);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error!", error);
    //   });
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
            <div className="message"> vào lớp muộn {props.item.time_late} phút</div>
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
      {props.item.type === 3 && (
        <div className="content">
          <div className="top-content">
            <div className="name">{props.item.student_name}</div>
            <div className="message"> báo cáo lỗi điểm danh</div>
          </div>
          {props.item.is_waiting === 1 && (
            <div className="bottom-content">
              <Button
                variant="outline-secondary"
                type="submit"
                className=""
                onClick={handleViewReportAttendance}
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
          <Button variant="danger" onClick={handleRefuseNotification}>
            Bỏ qua
          </Button>
          <Button variant="info" onClick={handleAcceptJoinClass}>
            Cho phép
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ReportAttendance */}
      <Modal show={showReportAttendance} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Không thể điểm danh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="main-report-attendance">
            <div className="top-report">
              <div className="top-report-text">
                <p>{props.item.student_name}</p>
                <p>{props.item.student_username}</p>
              </div>
              <img
                className="top-report-img"
                src={props.item.student_avt}
                alt="ảnh đại diện"
              ></img>
            </div>
            <div className="bottom-report">
              <div className="report-imgs">
                {props.item.imgs && (
                  <img
                    className="report-img"
                    src={props.item.imgs[0]}
                    alt=""
                  ></img>
                )}
                {props.item.imgs && (
                  <img
                    className="report-img"
                    src={props.item.imgs[1]}
                    alt=""
                  ></img>
                )}
              </div>
              <div className="report-imgs">
                {props.item.imgs && (
                  <img
                    className="report-img"
                    src={props.item.imgs[2]}
                    alt=""
                  ></img>
                )}
                {props.item.imgs && (
                  <img
                    className="report-img"
                    src={props.item.imgs[3]}
                    alt=""
                  ></img>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRefuseAttendance}>
            Bỏ qua
          </Button>
          <Button variant="info" onClick={handleAcceptAttendace}>
            Cho vào lớp
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
            {/* <Form.Group>
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
            </Form.Group> */}
            <div className="top-posible-fault-monitor">
              <div className="top-posible-text">
                <p>{props.item.student_name}</p>
                <p>{props.item.student_username}</p>
              </div>
              <img
                className="top-posible-img"
                src={props.item.student_avt}
                alt="ảnh đại diện"
              ></img>
            </div>
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold", textAlign: "center" }}>
                Ảnh minh chứng
              </Form.Label>
              <div className="imgs-posible-fault-monitor">
                <Row>
                  {props.item.imgs &&
                    props.item.imgs.map((item) => (
                      <Col xs={4} key={props.item.imgs.indexOf(item)}>
                        {item.timestamp && <div>
                          <div style={{textAlign: 'center',fontSize: '15px'}}>{formatHoursMinusSeconds(item.timestamp)}</div>
                          <img
                            className="img-posible-fault-monitor"
                            src={item.url}
                            alt="anh minh chung"
                          ></img>
                        </div>}
                        {!item.timestamp &&
                          <img
                            className="img-posible-fault-monitor"
                            src={item}
                            alt="anh minh chung"
                          ></img>}
                      </Col>
                    ))}
                </Row>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRefuseNotification}>
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
