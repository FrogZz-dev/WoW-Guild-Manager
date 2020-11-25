import React from "react";
import { useRoster } from "@contexts/RosterContext";
import { useFilters } from "@contexts/FiltersContext";
import CharacterRow from "./CharacterRow";

export default function CharactersBody({ onCharacterClick }) {
  const { roster } = useRoster();
  const { applyFiltersCallback } = useFilters();
  return (
    <tbody>
      {roster.filter(applyFiltersCallback).map((character) => (
        <CharacterRow
          key={character.id}
          characterData={character}
          onCharacterClick={onCharacterClick}
        />
      ))}
    </tbody>
  );
}
