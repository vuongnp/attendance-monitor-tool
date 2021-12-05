import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import axios from "axios";
import config from "../config/config";
// import RouterList from "../router/routerList";
import Header from "../components/header";
import "./Setting_mode.css";

export default function SettingMode() {
  const [type1, setType1] = useState({
    mode: "",
    time_to_late: 0,
    time_to_fault_monitor: 0,
  });
  const [type2, setType2] = useState({
    mode: "",
    time_to_late: 0,
    time_to_fault_monitor: 0,
  });
  const [type3, setType3] = useState({
    mode: "",
    time_to_late: 0,
    time_to_fault_monitor: 0,
  });
  const [showErrorParam, setShowErrorParam] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };
  const handleChangeEditMode1 = (e) => {
    type1.mode = e.target.value;
    setType1({ ...type1 });
  };
  const handleChangeEditMode2 = (e) => {
    type2.mode = e.target.value;
    setType2({ ...type2 });
  };
  const handleChangeEditMode3 = (e) => {
    type3.mode = e.target.value;
    setType3({ ...type3 });
  };
  const handleChangeEditTimeToLate1 = (e) => {
    type1.time_to_late = e.target.value;
    setType1({ ...type1 });
  };
  const handleChangeEditTimeToLate2 = (e) => {
    type2.time_to_late = e.target.value;
    setType2({ ...type2 });
  };
  const handleChangeEditTimeToLate3 = (e) => {
    type3.time_to_late = e.target.value;
    setType3({ ...type3 });
  };
  const handleChangeEditTimeToFaultMonitor1 = (e) => {
    type1.time_to_fault_monitor = e.target.value;
    setType1({ ...type1 });
  };
  const handleChangeEditTimeToFaultMonitor2 = (e) => {
    type2.time_to_fault_monitor = e.target.value;
    setType2({ ...type2 });
  };
  const handleChangeEditTimeToFaultMonitor3 = (e) => {
    type3.time_to_fault_monitor = e.target.value;
    setType3({ ...type3 });
  };
  const handleOKUpdateSetting = () => {
    let itemSetting = {
      type1: type1,
      type2: type2,
      type3: type3,
    };
    axios
      .post(`${config.SERVER_URI}/admin/update_setting_mode`, itemSetting)
      .then((response) => {
        console.log(response);
        if (response) {
          if (response.data.code === "1002") {
            setShowErrorParam(true);
          } else {
            setShowErrorParam(false);
            refreshPage();
          }
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    axios
      .get(`${config.SERVER_URI}/admin/get_setting_mode`)
      .then((response) => {
        console.log(response);
        if (response) {
          setType1(response.data.data.type1);
          setType2(response.data.data.type2);
          setType3(response.data.data.type3);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div id="setting-container">
      <Header home="admin_home" name="Quản lý đào tạo" />
      <div className="main-container">
        <h2 style={{ textAlign: "center", fontWeight: "bold", color: "red" }}>
          Cài đặt chế độ lớp học
        </h2>
        <Form>
          <h4
            style={{
              textAlign: "center",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            Lý thuyết
          </h4>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Chế độ <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  as="select"
                  defaultValue={type1.mode}
                  onChange={handleChangeEditMode1}
                >
                  <option style={{ display: "none" }}>{type1.mode}</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </Form.Control>
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Thời điểm vào muộn <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="phút"
                  value={type1.time_to_late}
                  onChange={handleChangeEditTimeToLate1}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Thời gian mất tập trung <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="phút"
                  value={type1.time_to_fault_monitor}
                  onChange={handleChangeEditTimeToFaultMonitor1}
                />
              </Col>
            </Form.Row>
          </Form.Group>

          <h4
            style={{
              textAlign: "center",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            Bài tập
          </h4>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Chế độ <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  as="select"
                  defaultValue={type2.mode}
                  onChange={handleChangeEditMode2}
                >
                  <option style={{ display: "none" }}>{type2.mode}</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </Form.Control>
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Thời điểm vào muộn <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="phút"
                  value={type2.time_to_late}
                  onChange={handleChangeEditTimeToLate2}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Thời gian mất tập trung <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="phút"
                  value={type2.time_to_fault_monitor}
                  onChange={handleChangeEditTimeToFaultMonitor2}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <h4
            style={{
              textAlign: "center",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            Lớp thi
          </h4>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Chế độ <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  as="select"
                  defaultValue={type3.mode}
                  onChange={handleChangeEditMode3}
                >
                  <option style={{ display: "none" }}>{type3.mode}</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </Form.Control>
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Thời điểm vào muộn <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="phút"
                  value={type3.time_to_late}
                  onChange={handleChangeEditTimeToLate3}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Form.Label column lg={10}>
                Thời gian mất tập trung <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="phút"
                  value={type3.time_to_fault_monitor}
                  onChange={handleChangeEditTimeToFaultMonitor3}
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
        <div style={{ width: "100%", textAlign: "center" }}>
          <Button variant="info" onClick={handleOKUpdateSetting}>
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
}
