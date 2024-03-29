import React, { useState, useEffect } from "react";
import { Container, Modal, Form, Col, Button } from "react-bootstrap";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import config from "../config/config";
// import RouterList from "../router/routerList";
import Header from "../components/header";
import GridClassTeacher from "../components/GridClassTeacher";
import LoadingImg from "../assert/loading.gif";
import "./Teacher_home.css";

export default function TeacherHome() {
  const teacher_username = localStorage.getItem("teacher_username");
  const [name, setName] = useState("User");
  const [classes, setClasses] = useState([]);
  const [oriClasses, setOriClasses] = useState([]);
  const [classAdd, setClassAdd] = useState({
    username: teacher_username,
    name: "",
    type: "Lý thuyết",
    description: "",
    schedule: "",
    duration: "",
  });
  const [textSeach, setTextSearch] = useState("");
  const handleSearch = () => {
    let classesResult = [];
    if (textSeach !== "") {
      for (var i = 0, c = oriClasses.length; i < c; i++) {
        if (oriClasses[i].name.toLowerCase().includes(textSeach.toLowerCase())) {
          classesResult.push(oriClasses[i]);
        }
        setClasses(classesResult);
      }
    } else {
      setClasses(oriClasses);
    }
  };
  const [showAdd, setShowAdd] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showErrorParam, setShowErrorParam] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };
  const handleShowAdd = () => {
    setShowAdd(true);
  };
  const handleCloseModal = () => {
    setShowErrorParam(false);
    setShowAdd(false);
  };
  const handleChangeAddName = (e) => {
    classAdd.name = e.target.value;
    setClassAdd({ ...classAdd });
  };
  const handleChangeAddType = (e) => {
    classAdd.type = e.target.value;
    setClassAdd({ ...classAdd });
  };
  const handleChangeAddDescription = (e) => {
    classAdd.description = e.target.value;
    setClassAdd({ ...classAdd });
  };
  const handleChangeAddDuration = (e) => {
    classAdd.duration = e.target.value;
    setClassAdd({ ...classAdd });
  };
  const handleChangeAddSchedule = (e) => {
    classAdd.schedule = e.target.value;
    setClassAdd({ ...classAdd });
  };
  const handleAddClass = () => {
    console.log(classAdd);
    axios
      .post(`${config.SERVER_URI}/teacher/newclass`, classAdd)
      .then((response) => {
        console.log(response);
        if (response.data.code === "1002") {
          setShowErrorParam(true);
        } else {
          setShowErrorParam(false);
          setShowAdd(false);
          refreshPage();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    setShowLoading(true);
    axios
      .get(`${config.SERVER_URI}/teacher_home_data/${teacher_username}`)
      .then((response) => {
        setShowLoading(false);
        console.log(response);
        if (response) {
          // setDatahome(response.data.data);
          setName(response.data.data.name);
          setClasses(response.data.data.classes);
          setOriClasses(response.data.data.classes);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [teacher_username]);

  return (
    <div id="teacher-container">
      {showLoading && <img src={LoadingImg} alt="loading" className="loading-img"></img>}
      {name && <Header name={name} home="teacher_home" />}
      <div className="main-container">
        <Container>
          <div className="top-container">
            <Button
              variant="outline-info"
              type="submit"
              className=""
              onClick={handleShowAdd}
            >
              Thêm lớp mới
          </Button>
            <SearchBar
              onChange={(text) => setTextSearch(text)}
              onRequestSearch={handleSearch}
              style={{
                //   margin: "0 auto",
                width: "40%",
                maxWidth: 700,
              }}
            />
          </div>
          {classes && <GridClassTeacher classes={classes} />}
        </Container>

        <Modal show={showAdd} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm lớp học</Modal.Title>
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
                      value={classAdd.name}
                      onChange={handleChangeAddName}
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
                      value={classAdd.description}
                      onChange={handleChangeAddDescription}
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
                    <Form.Control as="select" onChange={handleChangeAddType}>
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
                      value={classAdd.duration}
                      onChange={handleChangeAddDuration}
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
                      value={classAdd.schedule}
                      onChange={handleChangeAddSchedule}
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
            <Button variant="info" onClick={handleAddClass}>
              Thêm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
