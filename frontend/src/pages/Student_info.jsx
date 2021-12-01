import React, { useState, useEffect } from "react";
import { Modal, Form, Col, Button} from "react-bootstrap";
// import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
// import RouterList from "../router/routerList";
import DefaultInfoAvt from "../assert/default_avt.png"
import Header from "../components/header";
import "./UserInfo.css";

export default function StudentInfo() {
  const student_id = localStorage.getItem("student_id");
  const [selectedFile, setSelectedFile] = useState();
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "Nam",
    age: "",
    classes: "",
    student_id: "",
  });
  const [showEdit, setShowEdit] = useState(false);
  const [showErrorParam, setShowErrorParam] = useState(false);
  const [showErrorPhone, setShowErrorPhone] = useState(false);
  const [showErrorNonFace, setShowErrorNonFace] = useState(false);
  const [showErrorManyFace, setShowErrorManyFace] = useState(false);

  const handleClose = () => {
    setShowErrorParam(false);
    setShowEdit(false);
  };
  const handleChangeName = (e) => {
    user.name = e.target.value;
    setUser({ ...user });
  };
  const handleChangePhone = (e) => {
    user.phone = e.target.value;
    setUser({ ...user });
  };
  const handleChangeEmail = (e) => {
    user.email = e.target.value;
    setUser({ ...user });
  };
  const handleChangeGender = (e) => {
    user.gender = e.target.value;
    setUser({ ...user });
  };
  const handleChangeAge = (e) => {
    user.age = e.target.value;
    setUser({ ...user });
  };

  const handleUpdateInfo = () => {
    setShowEdit(true);
  };
  const handleOKUpdateInfo = () => {
    user.student_id = student_id;
    setUser({ ...user });
    axios
      .post(`${config.SERVER_URI}/user/updateuserinfo`, user)
      .then((response) => {
        console.log(response.data);
        if (response.data.code === "1002") {
          setShowErrorPhone(false);
          setShowErrorParam(true);
        } else if (response.data.code === "1004") {
          setShowErrorPhone(true);
          setShowErrorParam(false);
        } else {
          setShowErrorPhone(false);
          setShowErrorParam(false);
          refreshPage();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  const refreshPage = () => {
    window.location.reload();
  };
  const changeFile = (event) => {
    // console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };
  const handleUploadImg = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("student_id", localStorage.getItem("student_id"));
    axios({
      method: "post",
      url: "http://localhost:5000/user/changestudentavt",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        if (response.data.code === "9993") {
            setShowErrorNonFace(false);
            setShowErrorManyFace(true);
          } else if (response.data.code === "9994") {
            setShowErrorNonFace(true);
            setShowErrorManyFace(false);
          } else {
            setShowErrorNonFace(false);
            setShowErrorManyFace(false);
            refreshPage();
          }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/userinfo/${student_id}`)
      .then((response) => {
        console.log(response);
        if (response) {
          setUser(response.data.data);
          localStorage.setItem("student_avt", response.data.data.avatar);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [student_id]);
  return (
    <div className="user-info-container">
      {user && <Header name={user.name} home="student_home" />}
      <div className="info-main-container">
        <div className="left-info">
          <Form>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Tên đăng nhập
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.username}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Họ và tên
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.name}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Số điện thoại
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.phone}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Email
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.email}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Giới tính
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.gender}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Tuổi
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.age}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={6} style={{ fontWeight: "bold" }}>
                  Số lớp học
                </Form.Label>
                <Form.Label column lg={6}>
                  {user.classes}
                </Form.Label>
              </Form.Row>
            </Form.Group>
          </Form>
          <div className="btn-update-info">
            <Button variant="info" onClick={handleUpdateInfo}>
              Cập nhật thông tin
            </Button>
          </div>
        </div>
        <div className="right-info">
        {user.avatar !=="" ? <img src={user.avatar} alt="ảnh đại diện"></img> : <img src={DefaultInfoAvt} alt="ảnh đại diện"></img>}
          <div>
              Ảnh cần chụp chính diện, nhìn rõ khuôn mặt
          </div>
          <div>
              Không nhiều hơn một khuôn mặt
          </div>
          {showErrorNonFace && (
                <div className="text-error" style={{"textAlign":"center"}}>
                  Không tìm thấy khuôn mặt trong ảnh
                </div>
              )}
              {showErrorManyFace && (
                <div className="text-error" style={{"textAlign":"center"}}>
                    Có quá nhiều khuôn mặt trong ảnh
                </div>
              )}
          <Form.File
            type="file"
            label=""
            onChange={(e) => changeFile(e)}
            className="form-img"
          />
          <div className="btn-update-img">
            <Button variant="info" onClick={handleUploadImg}>
              Cập nhật ảnh đại diện
            </Button>
          </div>
        </div>
        {/* Edit */}
        <Modal show={showEdit} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Cập nhật thông tin cá nhân</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={4}>
                    Họ và tên <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Họ và tên"
                      value={user.name}
                      onChange={handleChangeName}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={4}>
                    Số điện thoại <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Số điện thoại"
                      value={user.phone}
                      maxLength={10}
                      onChange={handleChangePhone}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={4}>
                    Email
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={handleChangeEmail}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={9}>
                    Giới tính
                  </Form.Label>
                  <Col>
                    <Form.Control as="select" defaultValue={user.gender} onChange={handleChangeGender}>
                      <option style={{ display: "none" }}>{user.gender}</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </Form.Control>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={4}>
                    Tuổi
                  </Form.Label>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Tuổi"
                      value={user.age}
                      onChange={handleChangeAge}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
            </Form>
              {showErrorParam && (
                <div className="text-error" style={{"textAlign":"center"}}>
                  Vui lòng nhập đầy đủ thông tin bắt buộc
                </div>
              )}
              {showErrorPhone && (
                <div className="text-error" style={{"textAlign":"center"}}>
                    Số điện thoại không tồn tại
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="info" onClick={handleOKUpdateInfo}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
