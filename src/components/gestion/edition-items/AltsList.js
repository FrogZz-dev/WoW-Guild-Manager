import React from "react";
import wowData from "@utils/wowData";

export default function AltsList({ altCharacters, onRemove }) {
  return (
    <ul>
      {altCharacters.map((character) => (
        <li
          className={`character ${wowData.validateName(character.className)}`}
          id={character.id}
          key={character.id}
          onClick={onRemove}
        >
          {character.name}
        </li>
      ))}
    </ul>
  );
}
