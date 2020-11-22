import React from "react";
import "@styles/groupCharacter.css";
import { Spinner } from "react-bootstrap";
import { validateName } from "@utils/utilities";

export default function GroupCharacter({
  characterInfo,
  onCharacterClick = () => {},
}) {
  if (!characterInfo) return <Spinner animation="border" />;
  const addedClass = validateName(characterInfo?.className + "-group" ?? "");
  return (
    <div
      id={characterInfo?.id}
      className={`group-character ${addedClass}`}
      onClick={onCharacterClick}
    >
      {characterInfo?.name}
    </div>
  );
}
