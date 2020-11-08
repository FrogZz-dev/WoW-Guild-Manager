import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import wowData from "../utils/wowData";

export default function CharacterSheet({ characterInfo }) {
  const { name, className, level, iLvl, rank, spec } = characterInfo;
  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card className={"text-white bg-secondary"}>
          <Card.Header
            className={
              "w-100 text-center character " + wowData.validateName(className)
            }
          >
            {name}
          </Card.Header>
          <Card.Body>
            <p>
              {className} {spec}
            </p>
            <p>Niveau {level}</p>
            <p>{iLvl} iLvl</p>
            <p>Rang de guilde : {rank}</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
