import React from "react";
import "@styles/character.css";
import { validateName } from "@utils/utilities";

export default function CharacterRow({ characterData, onCharacterClick }) {
  const { id, name, className, spec, level, iLvl, rank } = characterData;

  const handleCharacterSelection = () => {
    onCharacterClick(characterData);
  };

  return (
    <tr
      className={"character " + validateName(className)}
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
