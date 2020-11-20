import React from "react";
import GroupCharacter from "../characters-display/GroupCharacter";

export default function GroupDisplay({
  groupCharactersList = [],
  onCharacterClick,
}) {
  return (
    <div id="group-display">
      {groupCharactersList?.map((character) => {
        return (
          <GroupCharacter
            characterInfo={character}
            key={character.id}
            onCharacterClick={onCharacterClick}
          />
        );
      })}
    </div>
  );
}
