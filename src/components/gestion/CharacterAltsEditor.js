/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { fireFunctions } from "@utils/firebase";
import { useAuth } from "@contexts/AuthContext";
import { useRoster } from "@contexts/RosterContext";
import EditButtons from "./edition-items/EditButtons";
import AltsList from "./edition-items/AltsList";
import MainSelection from "./edition-items/MainSelection";
import InfoMessage from "./edition-items/InfoMessage";

export default function CharacterAltsEditor({
  lastCharacter,
  setLastCharacter,
}) {
  const [altCharacters, setAltCharacters] = useState([]);
  const [documentId, setDocumentId] = useState();
  const [alertInfo, setAlertInfo] = useState({ message: "", type: "" });
  const { currentUser } = useAuth();
  const { loadRoster } = useRoster();

  useState();
  const mainRef = useRef();
  const { characterId } = useParams();

  // chargement de la liste des rerolls en fonction du personnage choisi
  const loadMember = async () => {
    const { docId, data } = await fireFunctions.getMemberAltsById(
      Number(characterId)
    );
    if (data !== undefined) {
      setDocumentId(docId);
      setAltCharacters(data.characters);
      mainRef.current.value = data.main;
    }
  };

  useEffect(() => {
    loadMember();
  }, []);

  // ajout du dernier personnage clické à la liste des rerolls
  useEffect(() => {
    const characterFound = altCharacters.find(
      (character) => character.id === lastCharacter.id
    );
    if (!characterFound) {
      setAltCharacters((altCharacters) => [...altCharacters, lastCharacter]);
    }
  }, [lastCharacter]);

  // retrait d'un personnage clické dans la liste
  const handleCharacterRemove = (e) => {
    const mainCharacterId = mainRef.current.value;

    const clickedId = e.target.id;
    if (mainCharacterId !== clickedId) {
      const tempAlts = [...altCharacters];
      tempAlts.splice(
        tempAlts.findIndex((character) => character.id === Number(clickedId)),
        1
      );

      setAltCharacters(tempAlts);
    }
  };

  const handleSave = async () => {
    if (currentUser) {
      try {
        if (documentId) {
          if (altCharacters.length > 1) {
            await fireFunctions.updateMemberAlts(
              documentId,
              mainRef.current.value,
              altCharacters
            );
          } else {
            await fireFunctions.deleteMemberAlts(documentId);
          }
        } else {
          if (altCharacters.length > 1) {
            await fireFunctions.addMemberAlts(
              mainRef.current.value,
              altCharacters
            );
          }
        }
      } catch (error) {
        console.log(error);
      }

      setAlertInfo({ message: "Rerolls enregistrés !", type: "success" });
      loadRoster();
      setTimeout(() => {
        setLastCharacter({});
      }, 5000);
    } else {
      setAlertInfo({ message: "Vous devez être connecté !", type: "warning" });
    }
  };

  if (!lastCharacter.id) {
    return <Redirect to="/management/browse" />;
  }

  return (
    <Card
      bg="dark"
      text="white"
      border="warning"
      className="w-100"
      style={{ maxWidth: "400px" }}
    >
      <InfoMessage info={alertInfo} />
      <Card.Body>
        <MainSelection mainRef={mainRef} altCharacters={altCharacters} />

        <AltsList
          altCharacters={altCharacters}
          onRemove={handleCharacterRemove}
        />
        <EditButtons onSave={handleSave} />
      </Card.Body>
    </Card>
  );
}
