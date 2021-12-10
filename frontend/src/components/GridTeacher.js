import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneTeacher from "./OneTeacher";
import "./Grid.css";

export default function GridTeacher(props) {
  return (
      <Container className="center-container">
        <Row>
          {props.teachers.map((item, id) => (
            <Col xs={6} key={id}>
              <OneTeacher item={item} />
            </Col>
          ))}
        </Row>
      </Container>
  );
}
