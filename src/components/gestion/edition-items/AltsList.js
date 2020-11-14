import React from "react";
import wowData from "@utils/wowData";

export default function AltsList({ altCharacters, onRemove }) {
  return (
    <ul>
      {altCharacters.map((character) => (
        <li
          key={Math.floor(Math.random() * 1000 * 1000)}
          className={`character ${wowData.validateName(character.className)}`}
          id={character.id}
          onClick={onRemove}
        >
          {character.name}
        </li>
      ))}
    </ul>
  );
}
