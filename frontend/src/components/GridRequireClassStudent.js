import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneStudentRequireClass from "./OneStudentRequireClass";
import "./GridClass.css";

export default function GridRequireClassStudent(props) {
  return (
      <Container className="center-container" style={{"marginTop": "-50px"}}>
        <Row>
          {props.classes.map((item, id) => (
            <Col xs={4} key={id}>
              <OneStudentRequireClass class={item} />
            </Col>
          ))}
        </Row>
      </Container>
  );
}
