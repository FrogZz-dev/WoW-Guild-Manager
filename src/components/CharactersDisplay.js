import React from "react";
import { Col, Row } from "react-bootstrap";
import Character from "./Character";

export default function CharactersDisplay({
  characters,
  infoToDisplay,
  onCharacterClick,
}) {
  return (
    <Row style={{ height: "65vh" }}>
      <Col className="overflow-auto mh-100">
        {characters.map((character) => (
          <Character
            characterInfo={character}
            infoToDisplay={infoToDisplay}
            onCharacterClick={onCharacterClick}
          />
        ))}
      </Col>
    </Row>
  );
}
