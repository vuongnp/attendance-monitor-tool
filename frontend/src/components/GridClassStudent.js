import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneStudentClass from "./OneStudentClass";
import "./Grid.css";

export default function GridClassStudent(props) {
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
