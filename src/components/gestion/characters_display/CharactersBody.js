import React from "react";
import { useRoster } from "@contexts/RosterContext";
import CharacterRow from "./CharacterRow";

export default function CharactersBody() {
  const { displayedCharacters } = useRoster();
  return (
    <tbody>
      {displayedCharacters.map((character) => (
        <CharacterRow key={character.id} characterData={character} />
      ))}
    </tbody>
  );
}
