import React from "react";
import { validateName } from "@utils/utilities";

export default function AltsList({ altCharacters, onRemove }) {
  return (
    <ul>
      {altCharacters?.map((character) => (
        <li
          key={character.id}
          className={`character ${validateName(character.className)}`}
          id={character.id}
          onClick={onRemove}
        >
          {character.name}
        </li>
      ))}
    </ul>
  );
}
