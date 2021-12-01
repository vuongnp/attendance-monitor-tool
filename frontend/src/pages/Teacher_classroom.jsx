import React, { useState, useEffect } from "react";
import { Modal, Form, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table } from "reactstrap";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DoneIcon from "@mui/icons-material/Done";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import config from "../config/config";
import RouterList from "../router/routerList";
import Header from "../components/header";
import StudentClassroomItem from "../components/StudentClassroomItem";
import OneNotification from "../components/OneNotification";
import Paging from "../components/Pagination";
import { socket } from "../App";
import "./Teacher_classroom.css";

export default function TeacherClassroom(props) {
  // console.log(window.location.pathname.split('/')[2]);
  // const class_id = props.match.params.id;
  const class_id = window.location.pathname.split("/")[2];
  const teacher_name = localStorage.getItem("teacher_name");
  const [students, setStudents] = useState([]);
  const numberStudentsPage = 1;
  const [studentsPage, setStudentsPage] = useState([]);
  const [numberPages, setNumberPages] = useState(1);
  const [classroom, setClassroom] = useState({
    id: "",
    name: "",
    description: "",
    schedule: "",
    type: "Lý thuyết",
    mode: "0",
    duration: "",
    code: "",
    is_learning: 0,
    students: [],
    time_to_late: 0,
    time_to_fault_monitor: 0
  });
  const [itemUpdateMode, setItemUpdateMode] = useState({
    id_class: class_id,
    mode: "",
  });
  const [itemStartLearn, setItemStartLearn] = useState({
    class_id: class_id,
    time_to_late: 0,
    time_to_fault_monitor: 0,
    start_time: 0,
  });
  const [studentdNotLearned, setStudentdNotLearned] = useState([]);
  // const [reportAttendanceItem, setReportAttendanceItem] = useState({});

  const [notifications, setNotifications] = useState([]);
  const [showMode0, setShowMode0] = useState(false);
  const [showMode1, setShowMode1] = useState(false);
  const [showMode2, setShowMode2] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showErrorParam, setShowErrorParam] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showListNoti, setShowListNoti] = useState(false);
  const [newNoti, setNewNoti] = useState(false);
  const [showLearning, setShowLearning] = useState(0);
  const [showSettingStartLearn, setShowSettingStartLearn] = useState(false);
  // const [showReportAttendance, setShowReportAttendance] = useState(false);
  const [showStudentNotLearned, setShowListStudentNotLearned] = useState(false);
  const [showTest, setShowTest] = useState(true);

  const handleNextPage = (event, page) => {
    let start = (page - 1) * numberStudentsPage;
    let end = start + numberStudentsPage;
    setStudentsPage(students.slice(start, end));
  };

  const refreshPage = () => {
    window.location.reload();
  };
  const handleShowEdit = () => {
    setShowEdit(true);
  };
  const handleCloseModal = () => {
    setShowErrorParam(false);
    setShowEdit(false);
    setShowNotification(false);
    setShowListNoti(false);
    setShowSettingStartLearn(false);
    // setShowReportAttendance(false);
    setShowListStudentNotLearned(false);
  };
  const handleChangeEditName = (e) => {
    classroom.name = e.target.value;
    setShowEdit({ ...classroom });
  };
  const handleChangeEditType = (e) => {
    classroom.type = e.target.value;
    setShowEdit({ ...classroom });
  };
  const handleChangeEditDescription = (e) => {
    classroom.description = e.target.value;
    setShowEdit({ ...classroom });
  };
  const handleChangeEditDuration = (e) => {
    classroom.duration = e.target.value;
    setShowEdit({ ...classroom });
  };
  const handleChangeEditSchedule = (e) => {
    classroom.schedule = e.target.value;
    setShowEdit({ ...classroom });
  };
  const handleOKEditClass = () => {
    classroom.id = class_id;
    setShowEdit({ ...classroom });
    console.log(classroom);
    axios
      .post(`${config.SERVER_URI}/teacher/updateclass`, classroom)
      .then((response) => {
        console.log(response.data);
        if (response.data.code === "1002") {
          setShowErrorParam(true);
        } else {
          setShowErrorParam(false);
          refreshPage();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const renderTableData = () => {
    return studentsPage.map((student) => {
      return (
        <StudentClassroomItem
          index={students.indexOf(student)}
          item={student}
          class_id={class_id}
          key={students.indexOf(student)}
        />
      );
    });
  };
  const renderTableNotLearned = () => {
    return studentdNotLearned.map((item) => {
      return (
        <tr className="one-row">
          <td>{studentdNotLearned.indexOf(item) + 1}</td>
          <td>{item.username}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
  };
  const handleChangeMode = (e) => {
    let mode = e.target.value;
    if (mode === "0") {
      setShowMode0(true);
      setShowMode1(false);
      setShowMode2(false);
    } else if (mode === "1") {
      setShowMode1(true);
      setShowMode0(false);
      setShowMode2(false);
    } else {
      setShowMode2(true);
      setShowMode1(false);
      setShowMode0(false);
    }
    itemUpdateMode.mode = e.target.value;
    setItemUpdateMode({ ...itemUpdateMode });
  };
  const handleSaveChangeMode = () => {
    itemUpdateMode.id_class = class_id;
    setItemUpdateMode({ ...itemUpdateMode });
    axios
      .post(`${config.SERVER_URI}/teacher/selectmode`, itemUpdateMode)
      .then((response) => {
        console.log(response);
        refreshPage();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleViewNotification = () => {
    setShowNotification(false);
    axios
      .get(`${config.SERVER_URI}/teacher/getNotification/${class_id}`)
      .then((response) => {
        setNotifications(response.data.data.notifications);
        setNewNoti(false);
        setShowListNoti(true);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleLearning = () => {
    setShowSettingStartLearn(true);
  };
  const handleChangeTimeToLate = (e) => {
    itemStartLearn.time_to_late = e.target.value;
    setItemStartLearn({ ...itemStartLearn });
  };
  const handleChangeTimeToFaultMonitor = (e) => {
    itemStartLearn.time_to_fault_monitor = e.target.value;
    setItemStartLearn({ ...itemStartLearn });
  };
  const handleOKStartLearn = () => {
    // itemStartLearn.class_id = class_id;
    itemStartLearn.start_time = new Date().getTime().toString();
    console.log(itemStartLearn);
    setItemStartLearn({ ...itemStartLearn });
    axios
      .post(`${config.SERVER_URI}/teacher/startlearning`, itemStartLearn)
      .then((response) => {
        if (response.data.code === "1002") {
          setShowErrorParam(true);
        } else {
          setShowErrorParam(false);
          setShowLearning(1);
          setShowSettingStartLearn(false);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleStopLearning = () => {
    if (classroom.mode !== "1") {
      axios
        .post(
          `${config.SERVER_URI}/teacher/getStudentNotLearned`,
          itemStartLearn
        )
        .then((response) => {
          setStudentdNotLearned(response.data.data);
          setShowListStudentNotLearned(true);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
    axios
      .post(`${config.SERVER_URI}/teacher/finishlearning`, itemStartLearn)
      .then((response) => {
        setShowLearning(0);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    socket.emit("class_stopped_learn", { data: students });
  };

  // const handleRefuseAttendance = () => {
  //   setShowReportAttendance(false);
  //   socket.emit("refuse_attendance", { data: reportAttendanceItem.student_id });
  // };
  // const handleAcceptAttendace = () => {
  //   setShowReportAttendance(false);
  //   socket.emit("accept_attenance", { data: reportAttendanceItem.student_id });
  // };
  const handleTest = () => {
    socket.emit("check_student_stay_in", {
      data: {
        class_id: class_id,
        students: students,
      },
    });
    setShowTest(false);
  };
  const handleStopTest = () => {
    setShowTest(true);
    let itemSaveFaultsStayin = {
      class_id: class_id,
    };
    axios
      .post(
        `${config.SERVER_URI}/teacher/saveFaultsStayin`,
        itemSaveFaultsStayin
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const handleSaveFaultsNotLearn = () => {
    setShowListStudentNotLearned(false);
    let itemSaveFaultsNotLearn = {
      class_id: class_id,
    };
    axios
      .post(
        `${config.SERVER_URI}/teacher/saveFaultsNotLearn`,
        itemSaveFaultsNotLearn
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  socket.on("posible_fault_monitor", () => {
    setShowNotification(true);
    setNewNoti(true);
  });
  socket.on("student_need_join", () => {
    setShowNotification(true);
    setNewNoti(true);
  });
  socket.on("report_attendance_from_student", () => {
    setShowNotification(true);
    setNewNoti(true);
    // setReportAttendanceItem(data["data"]);
    // console.log(reportAttendanceItem);
    // setShowReportAttendance(true);
  });

  useEffect(() => {
    console.log(classroom.mode);
    socket.emit("joinClassroom", class_id);
    axios
      .get(`http://localhost:5000/teacher/getclass/${class_id}`)
      .then((response) => {
        console.log(response);
        if (response) {
          setClassroom(response.data.data);
          setShowLearning(response.data.data.is_learning);
          setStudents(response.data.data.students);
          setNumberPages(
            Math.ceil(response.data.data.students.length / numberStudentsPage)
          );
          setStudentsPage(
            response.data.data.students.slice(0, numberStudentsPage)
          );
          if (response.data.data.mode === "0") {
            setShowMode0(true);
          } else if (response.data.data.mode === "1") {
            setShowMode1(true);
          } else {
            setShowMode2(true);
          }
          itemStartLearn.time_to_late = response.data.data.time_to_late;
          itemStartLearn.time_to_fault_monitor = response.data.data.time_to_fault_monitor;
          setItemStartLearn({...itemStartLearn});
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [class_id]);
  return (
    <div id="classroom-container">
      <Header name={teacher_name} home="teacher_home" />
      <div className="main-class-container">
        <Link to={RouterList.TEACHER_HOME}>Quản lý danh sách lớp</Link>
        <div className="top-class-container">
          <div className="left-top-class-container">
            <div className="title-info-class">Thông tin lớp</div>
            <BorderColorIcon
              style={{
                color: "rgb(101 174 191)",
                fontSize: 40,
                cursor: "pointer",
              }}
              onClick={handleShowEdit}
            />
            {newNoti && (
              <NotificationsActiveIcon
                style={{
                  color: "#eaa82c",
                  fontSize: 40,
                  cursor: "pointer",
                }}
                onClick={handleViewNotification}
              />
            )}
            {!newNoti && (
              <NotificationsIcon
                style={{
                  color: "rgb(101 174 191)",
                  fontSize: 40,
                  cursor: "pointer",
                }}
                onClick={handleViewNotification}
              />
            )}
          </div>
          <div>
            {showLearning === 1 && classroom.mode === "2" && showTest && (
              <Button
                variant="info"
                type="submit"
                className=""
                style={{marginRight: "10px"}}
                onClick={handleTest}
              >
                Kiểm tra bất chợt
              </Button>
            )}
            {showLearning === 1 && classroom.mode === "2" && !showTest && (
              <Button
                variant="secondary"
                type="submit"
                className=""
                style={{marginRight: "10px"}}
                onClick={handleStopTest}
              >
                Dừng kiểm tra
              </Button>
            )}
            {showLearning === 0 && (
              <Button
                variant="success"
                type="submit"
                className=""
                onClick={handleLearning}
              >
                Bắt đầu học
              </Button>
            )}
            {showLearning === 1 && (
              <Button
                variant="danger"
                type="submit"
                className=""
                onClick={handleStopLearning}
              >
                Kết thúc học
              </Button>
            )}
          </div>
        </div>
        <div className="center-class-container">
          <div className="left-center-class-container">
            <Form>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Tên lớp
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.name}
                  </Form.Label>
                </Form.Row>
              </Form.Group>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Mô tả
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.description}
                  </Form.Label>
                </Form.Row>
              </Form.Group>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Lịch học
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.schedule}
                  </Form.Label>
                </Form.Row>
              </Form.Group>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Loại lớp
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.type}
                  </Form.Label>
                </Form.Row>
              </Form.Group>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Thời lượng
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.duration} phút
                  </Form.Label>
                </Form.Row>
              </Form.Group>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Mã lớp
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.code}
                  </Form.Label>
                </Form.Row>
              </Form.Group>
              <Form.Group className="one-line">
                <Form.Row>
                  <Form.Label column lg={4} style={{ fontWeight: "bold" }}>
                    - Số học sinh
                  </Form.Label>
                  <Form.Label column lg={8}>
                    {classroom.students ? classroom.students.length : 0}
                  </Form.Label>
                </Form.Row>
              </Form.Group>
            </Form>
          </div>
          <div className="right-center-class-container">
            <div className="main-right-center-class-container">
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={7} style={{ fontWeight: "bold" }}>
                    Chọn chế độ hoạt động
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      defaultValue={classroom.mode}
                      onChange={handleChangeMode}
                    >
                      <option style={{ display: "none" }}>{classroom.mode}</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Form.Control>
                  </Col>
                  <Col>
                    <Button variant="info" onClick={handleSaveChangeMode}>
                      Lưu
                    </Button>
                  </Col>
                </Form.Row>
              </Form.Group>
              <div className="classroom-mode">
                <div className="one-mode">
                  <div>Điểm danh</div>
                  {showMode0 && (
                    <DoneIcon
                      style={{
                        color: "rgb(101 174 191)",
                        fontSize: 30,
                        marginLeft: 10,
                      }}
                    />
                  )}
                </div>
                <div className="one-mode">
                  <div>Giám sát</div>
                  {showMode1 && (
                    <DoneIcon
                      style={{
                        color: "rgb(101 174 191)",
                        fontSize: 30,
                        marginLeft: 10,
                      }}
                    />
                  )}
                </div>
                <div className="one-mode">
                  <div>Điểm danh và giám sát</div>
                  {showMode2 && (
                    <DoneIcon
                      style={{
                        color: "rgb(101 174 191)",
                        fontSize: 30,
                        marginLeft: 10,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ReportAttendance */}
        {/* <Modal show={showReportAttendance} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Không thể điểm danh</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reportAttendanceItem && (
              <div className="main-report-attendance">
                <div className="top-report">
                  <div className="top-report-text">
                    <p>{reportAttendanceItem.student_name}</p>
                    <p>{reportAttendanceItem.student_username}</p>
                  </div>
                  <img
                    className="top-report-img"
                    src={reportAttendanceItem.student_avt}
                    alt="ảnh đại diện"
                  ></img>
                </div>
                <div className="bottom-report">
                  <div className="report-imgs">
                    {reportAttendanceItem.imgs && (
                      <img
                        className="report-img"
                        src={reportAttendanceItem.imgs[0]}
                        alt=""
                      ></img>
                    )}
                    {reportAttendanceItem.imgs && (
                      <img
                        className="report-img"
                        src={reportAttendanceItem.imgs[1]}
                        alt=""
                      ></img>
                    )}
                  </div>
                  <div className="report-imgs">
                    {reportAttendanceItem.imgs && (
                      <img
                        className="report-img"
                        src={reportAttendanceItem.imgs[2]}
                        alt=""
                      ></img>
                    )}
                    {reportAttendanceItem.imgs && (
                      <img
                        className="report-img"
                        src={reportAttendanceItem.imgs[3]}
                        alt=""
                      ></img>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleRefuseAttendance}>
              Bỏ qua
            </Button>
            <Button variant="info" onClick={handleAcceptAttendace}>
              Cho vào lớp
            </Button>
          </Modal.Footer>
        </Modal> */}
        {/* Notification */}
        <Modal show={showNotification} onHide={handleCloseModal}>
          <Modal.Body style={{ textAlign: "center" }}>
            <span style={{ fontSize: 24 }}>Bạn có thông báo mới</span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="info" onClick={handleViewNotification}>
              Xem thông báo
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Notifications */}
        <Modal show={showListNoti} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            <div className="newest">Mới nhất</div>
            <div className="list-noti-container">
              {!notifications ? (
                <div>Không có thông báo</div>
              ) : (
                notifications.map((item) => (
                  <OneNotification
                    key={notifications.indexOf(item)}
                    item={item}
                  />
                ))
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        {/* List Student Not Learned */}
        <Modal show={showStudentNotLearned} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Danh sách không tham gia tiết học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {studentdNotLearned && (
              <Table hover className="table-content">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên đăng nhập</th>
                    <th>Họ và tên</th>
                  </tr>
                </thead>
                <tbody>{renderTableNotLearned()}</tbody>
              </Table>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="info" onClick={handleSaveFaultsNotLearn}>
              Lưu lại
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Edit class */}
        <Modal show={showEdit} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa thông tin lớp học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={3}>
                    Tên lớp <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Tên lớp"
                      value={classroom.name}
                      onChange={handleChangeEditName}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={3}>
                    Mô tả
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="textarea"
                      placeholder="Mô tả lớp học"
                      value={classroom.description}
                      onChange={handleChangeEditDescription}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={3}>
                    Loại lớp <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      defaultValue={classroom.type}
                      onChange={handleChangeEditType}
                    >
                      <option style={{ display: "none" }}>{classroom.type}</option>
                      <option value="Lý thuyết">Lý thuyết</option>
                      <option value="Bài tập">Bài tập</option>
                      <option value="Lớp thi">Lớp thi</option>
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={3}>
                    Thời lượng <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Thời lượng"
                      value={classroom.duration}
                      onChange={handleChangeEditDuration}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={3}>
                    Lịch học <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Lịch học"
                      value={classroom.schedule}
                      onChange={handleChangeEditSchedule}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
            </Form>
            {showErrorParam && (
              <div className="text-error" style={{ textAlign: "center" }}>
                Vui lòng nhập đầy đủ thông tin bắt buộc
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="info" onClick={handleOKEditClass}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Set param Attendance Monitor*/}
        <Modal show={showSettingStartLearn} onHide={handleCloseModal} size="sm">
          <Modal.Header closeButton>
            <Modal.Title>Cài đặt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={9}>
                    Thời điểm vào vào muộn{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={itemStartLearn.time_to_late}
                      onChange={handleChangeTimeToLate}
                    />
                  </Col>
                </Form.Row>
                <div
                  style={{
                    fontSize: "15px",
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  Số phút tính từ khi bắt đầu học
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={9}>
                    Thời gian mất tập trung{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={itemStartLearn.time_to_fault_monitor}
                      onChange={handleChangeTimeToFaultMonitor}
                    />
                  </Col>
                </Form.Row>
                <div
                  style={{
                    fontSize: "15px",
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  Số phút mất tập trung liên tục
                </div>
              </Form.Group>
            </Form>
            {showErrorParam && (
              <div className="text-error" style={{ textAlign: "center" }}>
                Vui lòng nhập đầy đủ thông tin bắt buộc
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="info" onClick={handleOKStartLearn}>
              Bắt đầu học
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="bottom-class-container">
          <div className="paging">
            <div className="left-paging"></div>
            <Paging
              count={numberPages}
              onChange={(event, page) => handleNextPage(event, page)}
            />
          </div>
          <Table hover className="table-content">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên đăng nhập</th>
                <th>Họ và tên</th>
                <th>Số vi phạm</th>
                <th>Chi tiết</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
