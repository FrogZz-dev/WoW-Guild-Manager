import React from "react";
import { Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import GroupDisplay from "./GroupDisplay";

export default function GroupsCard() {
  return (
    <Card
      bg="dark"
      border="warning"
      text="white"
      className="w-100 "
      style={{ maxWidth: "650px" }}
    >
      <Card.Body className="pl-2 pr-2">
        <Card.Header className="d-flex justify-content-center">
          <Form.Group controlId="group-selector">
            <Form.Control as="select" size="sm" className="bg-dark text-light">
              <option value="lastId">last groupe</option>
              <option value="bestId">best groupe</option>
              <option value="laughId">groupe laugh</option>
              <option value="loseId">groupe lose</option>
            </Form.Control>
          </Form.Group>
          <Link className="text-warning" to="/groups/edit-group/new-group">
            Créer un groupe
          </Link>
        </Card.Header>
        <Card.Title>Nom du groupe</Card.Title>
        <GroupDisplay />
      </Card.Body>
    </Card>
  );
}
