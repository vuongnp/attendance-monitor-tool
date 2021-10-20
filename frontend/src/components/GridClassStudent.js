import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneStudentClass from "./OneStudentClass";
import "./GridClassTeacher.css";

export default function GridClassStudent(props) {
  const grids = [
    {
      teacher: "Nguyễn Linh Xinh ",
      description:
        "Môn học học về kiến thức cơ bản của C 9h30 Thứ 2 hàng tuần 9h30 Thứ 2 hàng tuần",
      duration: 60,
      id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
      is_learning: 0,
      mode: "1",
      name: "Lập trình C",
      schedule: "9h30 Thứ 2 hàng tuần ",
      students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
      type: "Bài tập",
    },
    {
      teacher: "Nguyễn Linh Xinh ",
      description: "Môn học học về kiến thức cơ bản của C",
      duration: 60,
      id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
      is_learning: 0,
      mode: "1",
      name: "Lập trình C",
      schedule: "9h30 Thứ 2 hàng tuần ",
      students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
      type: "Bài tập",
    },
    {
      teacher: "Nguyễn Linh Xinh ",
      description: "Môn học học về kiến thức cơ bản của C",
      duration: 60,
      id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
      is_learning: 0,
      mode: "1",
      name: "Lập trình C",
      schedule: "9h30 Thứ 2 hàng tuần ",
      students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
      type: "Bài tập",
    },
    {
      teacher: "Nguyễn Linh Xinh ",
      description: "Môn học học về kiến thức cơ bản của C",
      duration: 60,
      id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
      is_learning: 0,
      mode: "1",
      name: "Lập trình C",
      schedule: "9h30 Thứ 2 hàng tuần ",
      students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
      type: "Bài tập",
    },
    {
      teacher: "Nguyễn Linh Xinh ",
      description: "Môn học học về kiến thức cơ bản của C",
      duration: 60,
      id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
      is_learning: 0,
      mode: "1",
      name: "Lập trình C",
      schedule: "9h30 Thứ 2 hàng tuần ",
      students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
      type: "Bài tập",
    },
  ];
  //   const grids = props.classes;
  return (
      <Container className="center-container">
        <Row>
          {props.classes.map((item, id) => (
            <Col xs={4} key={id}>
              <OneStudentClass class={item} />
            </Col>
          ))}
        </Row>
      </Container>
  );
}
