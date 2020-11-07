import React from "react";
import "../styles/character.css";
import wowData from "../utils/wowData";

export default function Character({
  characterInfo,
  infoToDisplay,
  onCharacterClick,
}) {
  const { id, name, className } = characterInfo;
  return (
    <p
      key={id}
      className={
        "cursor-pointer m-0 d-flex justify-content-between character " +
        wowData.validateName(className)
      }
      onClick={() => onCharacterClick(characterInfo)}
    >
      <span>{name}</span>
      <span>{characterInfo[infoToDisplay]}</span>
    </p>
  );
}
