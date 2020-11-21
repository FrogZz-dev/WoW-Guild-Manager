import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import CharactersDisplay from "../characters-display/CharactersDisplay";
import GroupEditorCard from "./GroupEditorCard";
import { fireGroupsFunctions } from "@utils/firebase";

export default function GroupEditor() {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [groupCharacters, setGroupCharacters] = useState([]);
  const [isModify, setIsModify] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
    setError("");
    if (
      !groupCharacters.find(
        (groupCharacter) => groupCharacter.id === character.id
      ) &&
      groupCharacters.length < 40
    ) {
      setGroupCharacters((groupCharacters) => [...groupCharacters, character]);
    } else if (groupCharacters.length === 40) {
      setError("Le groupe contient déjà 40 personnes!");
    }
  };

  const handleGroupSave = async () => {
    setError("");
    setSuccess("");

    if (!groupName) {
      setError("Vous devez entrer un nom pour le groupe");
      return;
    }

    if (!groupCharacters.length) {
      setError("Erreur, le groupe est vide !");
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
      setSuccess("Groupe enregistré");
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue lors de la sauvegarde du groupe.");
    }
  };

  const handleCharacterRemove = (e) => {
    setError("");
    setSuccess("");
    const clickedId = Number(e.target.id);
    const clickedIndex = groupCharacters.findIndex(
      (character) => character.id === clickedId
    );
    if (clickedIndex === -1) {
      setError("Unerreur est survenue");
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
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
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
