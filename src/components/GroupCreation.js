import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import CharactersDisplay from "./CharactersDisplay";

export default function GroupCreation({ characters, onCharacterClick }) {
  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card className={"text-white bg-secondary"}>
          <Card.Body>
            <CharactersDisplay
              className="ml-50"
              characters={characters}
              onCharacterClick={onCharacterClick}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
