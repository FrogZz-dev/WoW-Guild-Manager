import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Character from "../../characters-display/Character";
import { useAuth } from "@contexts/AuthContext";
import { useRoster } from "@contexts/RosterContext";
import { validateName } from "@utils/utilities";

export default function CharacterCard({
  lastCharacter = {},
  onCharacterClick,
}) {
  const { getAltsByCharacterId } = useRoster();

  const { id, name, className, spec, level, iLvl, rank } = lastCharacter;
  const { isVerifiedOnline } = useAuth();

  const [alts, setAlts] = useState([]);
  const [main, setMain] = useState();

  const history = useHistory();

  const handleModifyAlts = () => {
    history.push(`/members/edit-character/${id}`);
  };

  useEffect(() => {
    const rawAlts = getAltsByCharacterId(id);
    if (rawAlts) {
      setAlts(rawAlts.altsData.characters);
      setMain(rawAlts.altsData.main);
    } else {
      setAlts([]);
    }
  }, [id, getAltsByCharacterId]);

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
                className={`text-center character ${validateName(className)}`}
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
                {alts && alts.length
                  ? "Personnages liés:"
                  : "Aucun autre personnage"}
                <br />
                {alts &&
                  alts.map((character) => (
                    <Character
                      key={character.id}
                      characterInfo={character}
                      onCharacterClick={onCharacterClick}
                      isMain={main === character.id}
                    />
                  ))}
              </Card.Text>
            </>
          )}
        </Card.Body>
        {isVerifiedOnline() && (
          <Card.Footer>
            <Button
              variant="warning"
              onClick={handleModifyAlts}
              disabled={!id ? true : false}
            >
              Modifier les rerolls
            </Button>
          </Card.Footer>
        )}
      </Card>
    </>
  );
}
