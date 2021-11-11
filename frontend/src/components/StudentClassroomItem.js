import React, { useState} from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import config from "../config/config";
import "./StudentClassroomItem.css";

export default function StudentClassroomItem(props) {
    const [user, setUser] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "Nam",
        age: "",
        classes: "",
        faults: "",
        student_id: "",
      });
      const [showView, setShowView] = useState(false);
      const [showDelete, setShowDelete] = useState(false);
      const handleShowDelete = () => {
        setShowDelete(true);
      };
      const handleCloseModal = () => {
        setShowView(false);
        setShowDelete(false);
      };
      const handleDeleteStudent = () => {
        const deleteStudentItem = {
            id_class: props.class_id,
            id_student: props.item.id
        }
        axios
          .post(`${config.SERVER_URI}/teacher/deletestudent`, deleteStudentItem)
          .then((response) => {
            console.log(response);
            setShowDelete(false);
            refreshPage();
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      };
    const handleShowView = ()=>{
        setShowView(true);
        axios
      .get(`http://localhost:5000/teacher/getstudent/${props.item.id}`)
      .then((response) => {
        console.log(response);
        if (response) {
          setUser(response.data.data);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    }
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <tr id={props.item.id} className="one-row">
      <td>{props.index + 1}</td>
      <td>{props.item.username}</td>
      <td>{props.item.name}</td>
      <td>{props.item.faults}</td>
      <td>
        <VisibilityIcon style={{ color: "rgb(228 163 115)", fontSize: 35,cursor: "pointer" }}
         onClick={handleShowView}/>
      </td>
      <td>
        <DeleteIcon style={{ color: "rgb(220 94 94)", fontSize: 35,cursor: "pointer" }}
        onClick={handleShowDelete} />
      </td>
      {/* View */}
      <Modal show={showView} onHide={handleCloseModal}size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thông tin học sinh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="body-view-student">
            <div className="left">
        <Form>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Tên đăng nhập
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.username}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Họ và tên
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.name}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Số điện thoại
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.phone}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Email
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.email}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Giới tính
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.gender}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Tuổi
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.age}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Số lớp học
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.classes}
                </Form.Label>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={5} style={{ fontWeight: "bold" }}>
                  Số vi phạm
                </Form.Label>
                <Form.Label column lg={7}>
                  {user.faults}
                </Form.Label>
              </Form.Row>
            </Form.Group>
          </Form>
          </div>
            <div className="right">
              {user.avatar ? (
                <img src={user.avatar} className="right-avt" alt="avatar"></img>
              ) : (
                <img
                  src="/src/asset/default_avt.png"
                  className="right-avt"
                  alt="avatar"
                ></img>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete */}
      <Modal show={showDelete} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa học sinh khỏi lớp</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>
            Bạn muốn xóa học sinh {props.item.name} khỏi lớp học?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </tr>
  );
}
