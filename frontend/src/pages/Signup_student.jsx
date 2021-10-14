import React, { useState} from "react";
import { Form, Col, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import RouterList from "../router/routerList";
import "./Signup.css";

export default function SignupStudent() {
  // console.log(props)
  const history = useHistory();
  const [showErrorParam, setShowErrorParam] = useState(false);
  const [showErrorPhone, setShowErrorPhone] = useState(false);
  const [showErrorUsername, setShowErrorUsername] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    email: "",
    gender: "Male",
    age: "",
  });
  const handleChangeUsername = (e) => {
    user.username = e.target.value;
    setUser({ ...user });
  };
  const handleChangePassword = (e) => {
    user.password = e.target.value;
    setUser({ ...user });
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
  const handleSignup = () => {
      console.log(user);
    axios
      .post(`${config.SERVER_URI}/signup_student`, user)
      .then((response) => {
        console.log(response.data);
        if(response.data.code=='1002'){
            setShowErrorPhone(false);
            setShowErrorUsername(false);
            setShowErrorParam(true);
        }
        else if(response.data.code=='1004'){
            setShowErrorPhone(true);
            setShowErrorUsername(false);
            setShowErrorParam(false);
        }
        else if(response.data.code=='1015'){
            setShowErrorPhone(false);
            setShowErrorUsername(true);
            setShowErrorParam(false);
        }
        else{
            setShowErrorPhone(false);
            setShowErrorUsername(false);
            setShowErrorParam(false);
            history.push("/");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="student-container">
      <h2 style={{ color: "red", marginTop: "5%" }}>
        ĐĂNG KÝ TÀI KHOẢN HỌC SINH
      </h2>
      <div className="form-signup-student">
        <Form>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={4}>
                Tên đăng nhập <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={user.username}
                  onChange={handleChangeUsername}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={4}>
                Mật khẩu <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="password"
                  placeholder="Mật khẩu"
                  value={user.password}
                  onChange={handleChangePassword}
                />
              </Col>
            </Form.Row>
          </Form.Group>
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
              <Form.Label column lg={10}>
                Giới tính
              </Form.Label>
              <Col>
                <Form.Control as="select" onChange={handleChangeGender}>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
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
      </div>
      <div className="text-signin">
        {showErrorParam &&
            <div className="text-error">Vui lòng nhập đầy đủ thông tin bắt buộc</div>
        }
        {showErrorPhone &&
            <div className="text-error">Số điện thoại không tồn tại</div>
        }
        {showErrorUsername &&
            <div className="text-error">Tên đăng nhập đã tồn tại</div>
        }
        <Button variant="primary" type="submit" className="btn-signup-student" onClick={handleSignup}>
          Tạo tài khoản
        </Button>
        <div className="link-to-sign-in">
          <Link to={RouterList.WELCOME}>Đã có tài khoản? Đăng nhập ngay</Link>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
