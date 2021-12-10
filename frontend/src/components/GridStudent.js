import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneStudent from "./OneStudent";
import "./Grid.css";

export default function GridStudent(props) {
  return (
      <Container className="center-container">
        <Row>
          {props.students.map((item, id) => (
            <Col xs={6} key={id}>
              <OneStudent item={item} />
            </Col>
          ))}
        </Row>
      </Container>
  );
}
