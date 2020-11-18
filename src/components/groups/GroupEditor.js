import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import CharactersDisplay from "../characters-display/CharactersDisplay";
import GroupEditorCard from "./GroupEditorCard";
import { fireGroupsFunctions } from "@utils/firebase";

export default function GroupEditor({ lastCharacter }) {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [groupCharacters, setGroupCharacters] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    if (lastCharacter) {
      setGroupCharacters((groupCharacters) => [
        ...groupCharacters,
        lastCharacter,
      ]);
    }
  }, [lastCharacter]);

  const handleNameChange = (e) => {
    if (e.target.value.length < 30) {
      setGroupName(e.target.value);
    }
  };

  const handleCharacterSelection = (character) => {
    if (
      !groupCharacters.find(
        (groupCharacter) => groupCharacter.id === character.id
      ) &&
      groupCharacters.length < 40
    ) {
      setGroupCharacters((groupCharacters) => [...groupCharacters, character]);
    }
  };

  const handleGroupSave = async () => {
    setError("");
    setSuccess("");

    if (!groupName) {
      setError("Vous devez entrer un nom pour le groupe");
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
      if (groupId === "new-group") {
        newGroupId = await fireGroupsFunctions.addGroup(
          saveGroupCharacters,
          groupName
        );
      }
      setSuccess("success");
      if (newGroupId) {
        history.push(`/groups/edit-group/${newGroupId}`);
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue lors de la sauvegarde du groupe.");
    }
  };

  return (
    <>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <GroupEditorCard
        groupName={groupName}
        groupCharacters={groupCharacters}
        onNameChange={handleNameChange}
        onSave={handleGroupSave}
      />
      <CharactersDisplay onCharacterClick={handleCharacterSelection} />
    </>
  );
}
