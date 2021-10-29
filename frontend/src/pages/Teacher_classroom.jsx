import React, { useState, useEffect } from "react";
import { Modal, Form, Col, Button, FormControl } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { Table } from "reactstrap";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DoneIcon from "@mui/icons-material/Done";
import config from "../config/config";
import RouterList from "../router/routerList";
import Header from "../components/header";
import StudentClassroomItem from "../components/StudentClassroomItem";
import Paging from "../components/Pagination";
import "./Teacher_classroom.css";

export default function TeacherClassroom(props) {
  const class_id = props.match.params.id;
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
    is_learning: "",
    students: [],
  });
  const [itemUpdateMode, setItemUpdateMode] = useState({
    id_class: class_id,
    mode: "",
  });
  const [showMode0, setShowMode0] = useState(false);
  const [showMode1, setShowMode1] = useState(false);
  const [showMode2, setShowMode2] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showErrorParam, setShowErrorParam] = useState(false);

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
        if (response.data.code == "1002") {
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
        />
      );
    });
  };
  const handleChangeMode = (e) => {
    let mode = e.target.value;
    if (mode == "0") {
      setShowMode0(true);
      setShowMode1(false);
      setShowMode2(false);
    } else if (mode == "1") {
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
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    console.log(classroom.mode);
    axios
      .get(`http://localhost:5000/teacher/getclass/${class_id}`)
      .then((response) => {
        console.log(response);
        if (response) {
          setClassroom(response.data.data);
          setStudents(response.data.data.students);
          setNumberPages(Math.ceil(response.data.data.students.length / numberStudentsPage));
          setStudentsPage(response.data.data.students.slice(0, numberStudentsPage));
          if (response.data.data.mode == "0") {
            setShowMode0(true);
          } else if (response.data.data.mode == "1") {
            setShowMode1(true);
          } else {
            setShowMode2(true);
          }
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
          </div>
          <Button
            variant="success"
            // onClick={handleCloseModal}
          >
            Bắt đầu giám sát
          </Button>
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
                      <option value="0">1</option>
                      <option value="1">2</option>
                      <option value="2">3</option>
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
