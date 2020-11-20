import React from "react";
import wowData from "@utils/wowData";
import "@styles/character.css";

export default function CharacterRow({ characterData, onCharacterClick }) {
  const { id, name, className, spec, level, iLvl, rank } = characterData;

  const handleCharacterSelection = () => {
    onCharacterClick(characterData);
  };

  return (
    <tr
      className={"character " + wowData.validateName(className)}
      onClick={handleCharacterSelection}
      id={id}
    >
      <td>{name}</td>
      <td>{className}</td>
      <td>{spec}</td>
      <td>{level}</td>
      <td>{iLvl}</td>
      <td>{rank}</td>
    </tr>
  );
}
