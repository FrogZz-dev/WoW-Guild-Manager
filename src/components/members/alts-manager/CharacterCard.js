import React from "react";
import { Button, Card } from "react-bootstrap";
import wowData from "@utils/wowData";
import { Link } from "react-router-dom";
import Character from "../../characters-display/Character";
import { useAuth } from "@contexts/AuthContext";

export default function CharacterCard({
  lastCharacter = {},
  onCharacterClick,
}) {
  const { id, name, className, spec, level, iLvl, rank, alts } = lastCharacter;
  const { currentUser } = useAuth();

  return (
    <>
      <Card
        bg="dark"
        text="white"
        border="warning"
        className="w-100"
        style={{ minHeight: "20vh", maxWidth: "400px" }}
      >
        <Card.Body>
          {!id && <Card.Title>Sélectionnez un personnage</Card.Title>}

          {id && (
            <>
              <Card.Title
                className={`text-center character ${wowData.validateName(
                  className
                )}`}
              >
                {name}
              </Card.Title>
              <Card.Text>
                {rank}
                <br />
                {className} {spec}
                <br />
                Niveau {level}
                <br />
                {iLvl} iLvl
                <br />
                {alts.length ? "Personnages liés:" : "Aucun autre personnage"}
                <br />
                {alts.map((character) => (
                  <Character
                    key={character.id}
                    characterInfo={character}
                    onCharacterClick={onCharacterClick}
                  />
                ))}
              </Card.Text>

              <hr className="bg-light" />
              {currentUser && (
                <Link to={`/members/edit-character/${id}`}>
                  <Button variant="warning">Modifier les rerolls</Button>
                </Link>
              )}
              {!currentUser && (
                <span>Connectez-vous pour effectuer des modifications</span>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
