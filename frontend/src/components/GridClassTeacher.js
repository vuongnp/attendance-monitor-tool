import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneTeacherClass from "./OneTeacherClass";
import "./GridClass.css";

export default function GridClassTeacher(props) {
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
