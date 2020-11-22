/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fireAltsFunctions } from "@utils/firebase";
import { useRoster } from "../../../contexts/RosterContext";
import { useAuth } from "../../../contexts/AuthContext";
import EditButtons from "../../edition-items/EditButtons";
import AltsList from "../../edition-items/AltsList";
import MainSelection from "../../edition-items/MainSelection";
import InfoMessage from "../../edition-items/InfoMessage";

export default function CharacterAltsEditor({ lastCharacter = {} }) {
  const [altCharacters, setAltCharacters] = useState([]);
  const [documentId, setDocumentId] = useState();
  const [alertInfo, setAlertInfo] = useState({ message: "", type: "" });
  const {
    loadRoster,
    setIsAltFiltered,
    getCharacterById,
    isLoadingRoster,
  } = useRoster();

  const { isMember, isVerifiedOnline } = useAuth();
  const mainRef = useRef();
  const { characterId } = useParams();

  // chargement de la liste des rerolls en fonction du personnage choisi
  const loadMember = async () => {
    const { docId, altsData } = await fireAltsFunctions.getMemberAltsById(
      Number(characterId)
    );
    if (altsData !== undefined) {
      setDocumentId(docId);
      setAltCharacters(altsData.characters);
      mainRef.current.value = altsData.main;
    } else {
      setAltCharacters([getCharacterById(Number(characterId))]);
    }
  };

  useEffect(() => {
    if (!isLoadingRoster) {
      loadMember();
      setIsAltFiltered(true);
      return () => setIsAltFiltered(false);
    }
  }, [isLoadingRoster]);

  // ajout du dernier personnage clické à la liste des rerolls
  useEffect(() => {
    if (Object.keys(lastCharacter).length) {
      const characterFound = altCharacters.find(
        (character) => character.id === lastCharacter.id
      );
      if (!characterFound) {
        setAltCharacters((altCharacters) => [...altCharacters, lastCharacter]);
      }
    }
  }, [lastCharacter]);

  useEffect(() => {
    return () => {};
  }, [altCharacters]);

  // retrait d'un personnage clické dans la liste des alts
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
    if (!isMember()) {
      setAlertInfo({
        message: "Vous devez être membre pour accéder à la sauvegarde !",
        type: "warning",
      });
      return;
    }

    if (!isVerifiedOnline()) {
      setAlertInfo({
        message:
          "Vous devez être connecté avec un compte vérifié pour accéder à la sauvegarde !",
        type: "warning",
      });
      return;
    }

    try {
      if (documentId) {
        if (altCharacters.length > 1) {
          await fireAltsFunctions.updateMemberAlts(
            documentId,
            mainRef.current.value,
            altCharacters
          );
        } else {
          await fireAltsFunctions.deleteMemberAlts(documentId);
        }
      } else {
        if (altCharacters.length > 1) {
          await fireAltsFunctions.addMemberAlts(
            mainRef.current.value,
            altCharacters
          );
        }
      }
      setAlertInfo({ message: "Rerolls enregistrés !", type: "success" });
      loadRoster();
    } catch (error) {
      setAlertInfo({
        message: "Vous devez être connecté !",
        type: "warning",
      });
      console.log(error);
    }
  };

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
      </Card.Body>
      <Card.Footer>
        <EditButtons onSave={handleSave} returnPath="/members/browse" />
      </Card.Footer>
    </Card>
  );
}
