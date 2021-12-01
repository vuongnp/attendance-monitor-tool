import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import OneAdminClass from "./OneAdminClass";
import "./GridClass.css";

export default function GridClassAdmin(props) {
  return (
      <Container className="center-container">
        <Row>
          {props.classes.map((item, id) => (
            <Col xs={4} key={id}>
              <OneAdminClass class={item} />
            </Col>
          ))}
        </Row>
      </Container>
  );
}
