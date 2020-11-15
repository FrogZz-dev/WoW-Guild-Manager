import React from "react";
import { Card } from "react-bootstrap";
import GroupDisplay from "./GroupDisplay";

export default function GroupsCard() {
  return (
    <Card bg="dark" border="warning" text="white">
      <Card.Body>
        <Card.Title>Nom du groupe</Card.Title>
        <GroupDisplay />
      </Card.Body>
    </Card>
  );
}
