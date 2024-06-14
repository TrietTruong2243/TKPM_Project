import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";

const CenteredSpinner = ({ color }) => {
  return (
    <Container>
      <Row
        className="justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Col className="text-center">
          <Spinner
            style={{ color: color ? color : "white" }}
            animation="border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
      </Row>
    </Container>
  );
};

export default CenteredSpinner;
