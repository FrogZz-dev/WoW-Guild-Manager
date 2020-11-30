import React from "react";
import { validateName } from "@utils/utilities";
import { useRoster } from "@contexts/RosterContext";

export default function Character({
  characterInfo,
  onCharacterClick,
  isMain = false,
}) {
  const { getCharacterById } = useRoster();
  const handleClick = () => {
    onCharacterClick(getCharacterById(characterInfo.id));
  };

  return (
    <span
      className={`mr-2 character ${validateName(characterInfo.className)}${
        isMain ? " main-character" : ""
      }`}
      onClick={handleClick}
    >
      {characterInfo.name}
    </span>
  );
}
