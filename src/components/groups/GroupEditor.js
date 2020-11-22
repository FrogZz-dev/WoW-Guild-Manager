import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import CharactersDisplay from "../characters-display/CharactersDisplay";
import GroupEditorCard from "./GroupEditorCard";
import { fireGroupsFunctions } from "@utils/firebase";
import { useAuth } from "@contexts/AuthContext";

export default function GroupEditor() {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [groupCharacters, setGroupCharacters] = useState([]);
  const [isModify, setIsModify] = useState(false);
  const [message, setMessage] = useState(undefined);
  const { isMember, isVerifiedOnline } = useAuth();

  const history = useHistory();

  useEffect(() => {
    if (groupId !== "new-group") {
      const loadGroup = async () => {
        try {
          const groupData = await fireGroupsFunctions.getGroupById(groupId);
          if (groupData) {
            setGroupName(groupData.name);
            setGroupCharacters(groupData.characters);
            setIsModify(true);
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadGroup();
    }
  }, [groupId]);

  const handleNameChange = (e) => {
    if (e.target.value.length < 30) {
      setGroupName(e.target.value);
    }
  };

  const handleCharacterSelection = (character) => {
    setMessage(undefined);

    if (
      !groupCharacters.find(
        (groupCharacter) => groupCharacter.id === character.id
      ) &&
      groupCharacters.length < 40
    ) {
      setGroupCharacters((groupCharacters) => [...groupCharacters, character]);
    } else if (groupCharacters.length === 40) {
      setMessage({
        text: "Le groupe contient déjà 40 personnes!",
        type: "danger",
      });
    }
  };

  const handleGroupSave = async () => {
    setMessage(undefined);

    if (!isMember()) {
      setMessage({
        text: "Vous devez être membre pour accéder à la sauvegarde !",
        type: "warning",
      });
      return;
    }

    if (!isVerifiedOnline()) {
      setMessage({
        text:
          "Vous devez être connecté avec un compte vérifié pour accéder à la sauvegarde !",
        type: "warning",
      });
      return;
    }

    if (!groupName) {
      setMessage({
        text: "Vous devez entrer un nom pour le groupe",
        type: "danger",
      });
      return;
    }

    if (!groupCharacters.length) {
      setMessage({ text: "Erreur, le groupe est vide !", type: "danger" });
      return;
    }

    const saveGroupCharacters = groupCharacters.map((character) => {
      return {
        id: character.id,
        name: character.name,
        className: character.className,
      };
    });

    let newGroupId;
    try {
      if (isModify) {
        await fireGroupsFunctions.updateGroup(
          saveGroupCharacters,
          groupName,
          groupId
        );
      } else {
        newGroupId = await fireGroupsFunctions.addGroup(
          saveGroupCharacters,
          groupName
        );
        if (newGroupId) {
          history.push(`/groups/edit-group/${newGroupId}`);
        }
      }
      setMessage({ text: "Groupe enregistré", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({
        text: "Une erreur est survenue lors de la sauvegarde du groupe.",
        type: "danger",
      });
    }
  };

  const handleCharacterRemove = (e) => {
    const clickedId = Number(e.target.id);
    const clickedIndex = groupCharacters.findIndex(
      (character) => character.id === clickedId
    );
    if (clickedIndex === -1) {
      setMessage({ text: "Une erreur est survenue", type: "danger" });
    } else {
      setGroupCharacters((groupCharacters) => {
        const tempGroup = [...groupCharacters];
        tempGroup.splice(clickedIndex, 1);
        return tempGroup;
      });
    }
  };

  return (
    <>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <GroupEditorCard
        groupName={groupName}
        groupCharacters={groupCharacters}
        onNameChange={handleNameChange}
        onSave={handleGroupSave}
        onCharacterClick={handleCharacterRemove}
      />
      <CharactersDisplay onCharacterClick={handleCharacterSelection} />
    </>
  );
}
