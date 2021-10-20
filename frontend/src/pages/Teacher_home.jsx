import React, { useState, useEffect } from "react";
import { Modal, Form, Col, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import config from "../config/config";
import RouterList from "../router/routerList";
import Header from "../components/header";
import GridClassTeacher from "../components/GridClassTeacher";
import "./Teacher_home.css";

export default function TeacherHome() {
    const teacher_username = localStorage.getItem("teacher_username");
  const [datahome, setDatahome] = useState({
    name: "User",
    classes: [],
  });
  const [classAdd, setClassAdd] = useState({
      username: teacher_username,
    name: "",
    type: "Lý thuyết",
    description: "",
    schedule: "",
    duration: ""
  });
  const [showAdd, setShowAdd] = useState(false);
  
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
        if (response.data.code == "1002") {
            setShowErrorParam(true);
          }else{
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
    axios
      .get(`${config.SERVER_URI}/teacher_home_data/${teacher_username}`)
      .then((response) => {
        console.log(response);
        if (response) {
          setDatahome(response.data.data);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [teacher_username]);

  return (
    <div id="teacher-container">
      {datahome && <Header name={datahome.name} home="teacher_home"/>}

      <div className="main-container">
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
            onChange={() => console.log("onChange")}
            onRequestSearch={() => console.log("onRequestSearch")}
            style={{
            //   margin: "0 auto",
              width: "40%",
              maxWidth: 700,
            }}
          />
        </div>
        {datahome && <GridClassTeacher classes={datahome.classes} />}
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
              <div className="text-error" style={{textAlign: "center"}}>
                Vui lòng nhập đầy đủ thông tin bắt buộc
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddClass}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
      
      </div>
    </div>
  );
}
