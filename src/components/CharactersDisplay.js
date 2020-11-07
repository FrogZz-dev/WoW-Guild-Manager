import React from "react";
import Character from "./Character";

export default function CharactersDisplay({
  characters,
  infoToDisplay,
  onCharacterClick,
}) {
  return (
    <div
      className="overflow-auto h-auto"
      style={{ margin: "auto", minWidth: "160px" }}
    >
      {characters.map((character) => (
        <Character
          characterInfo={character}
          infoToDisplay={infoToDisplay}
          onCharacterClick={onCharacterClick}
        />
      ))}
    </div>
  );
}
