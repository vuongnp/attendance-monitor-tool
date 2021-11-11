import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneTeacherClass from "./OneTeacherClass";
import "./GridClass.css";

export default function GridClassTeacher(props) {
  // let [categories, setCategories] = React.useState([]);
  // const grids = [
  //   {
  //     code: "XH0A3U",
  //     description:
  //       "Môn học học về kiến thức cơ bản của C 9h30 Thứ 2 hàng tuần 9h30 Thứ 2 hàng tuần",
  //     duration: 60,
  //     id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
  //     is_learning: 0,
  //     mode: "1",
  //     name: "Lập trình C",
  //     schedule: "9h30 Thứ 2 hàng tuần ",
  //     students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
  //     teacher: "372340cb-d44b-48a6-9edd-c350aa2ec960",
  //     type: "Bài tập",
  //   },
  //   {
  //     code: "XH0A3U",
  //     description: "Môn học học về kiến thức cơ bản của C",
  //     duration: 60,
  //     id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
  //     is_learning: 0,
  //     mode: "1",
  //     name: "Lập trình C",
  //     schedule: "9h30 Thứ 2 hàng tuần ",
  //     students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
  //     teacher: "372340cb-d44b-48a6-9edd-c350aa2ec960",
  //     type: "Bài tập",
  //   },
  //   {
  //     code: "XH0A3U",
  //     description: "Môn học học về kiến thức cơ bản của C",
  //     duration: 60,
  //     id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
  //     is_learning: 0,
  //     mode: "1",
  //     name: "Lập trình C",
  //     schedule: "9h30 Thứ 2 hàng tuần ",
  //     students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
  //     teacher: "372340cb-d44b-48a6-9edd-c350aa2ec960",
  //     type: "Bài tập",
  //   },
  //   {
  //     code: "XH0A3U",
  //     description: "Môn học học về kiến thức cơ bản của C",
  //     duration: 60,
  //     id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
  //     is_learning: 0,
  //     mode: "1",
  //     name: "Lập trình C",
  //     schedule: "9h30 Thứ 2 hàng tuần ",
  //     students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
  //     teacher: "372340cb-d44b-48a6-9edd-c350aa2ec960",
  //     type: "Bài tập",
  //   },
  //   {
  //     code: "XH0A3U",
  //     description: "Môn học học về kiến thức cơ bản của C",
  //     duration: 60,
  //     id: "00faf360-7cb0-4240-9f3f-f7ccd9d5ac47",
  //     is_learning: 0,
  //     mode: "1",
  //     name: "Lập trình C",
  //     schedule: "9h30 Thứ 2 hàng tuần ",
  //     students: ["c61bd9c1-06f8-4fa3-953d-9337f8e554f6"],
  //     teacher: "372340cb-d44b-48a6-9edd-c350aa2ec960",
  //     type: "Bài tập",
  //   },
  // ];
  //   const grids = props.classes;
  return (
      <Container className="center-container">
        <Row>
          {props.classes.map((item, id) => (
            <Col xs={4} key={id}>
              <OneTeacherClass class={item} />
            </Col>
          ))}
        </Row>
      </Container>
  );
}
