import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Card } from "react-bootstrap";

export default function WorkInProgress() {
  return (
    <Card bg="dark" border="warning" text="warning">
      <Card.Body className="text-center">
        <Card.Title style={{ fontSize: "2.5rem" }}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-danger mr-2"
          />
          Travaux en cours !
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-danger ml-2"
          />
        </Card.Title>
        <Card.Body>
          <FontAwesomeIcon
            className="text-warning"
            style={{ fontSize: "5rem" }}
            icon={faTools}
          />
        </Card.Body>
      </Card.Body>
    </Card>
  );
}
