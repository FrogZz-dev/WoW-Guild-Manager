import React from "react";
import "@styles/groupCharacter.css";
import wowData from "@utils/wowData";
import { Spinner } from "react-bootstrap";

export default function GroupCharacter({
  characterInfo,
  onCharacterClick = () => {},
}) {
  if (!characterInfo) return <Spinner animation="border" />;
  const addedClass = wowData.validateName(
    characterInfo?.className + "-group" ?? ""
  );
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
