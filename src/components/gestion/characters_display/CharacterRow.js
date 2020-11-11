import React from "react";
import wowData from "@utils/wowData";
import "@styles/character.css";

export default function CharacterRow({ characterData }) {
  const { name, className, spec, level, iLvl, rank } = characterData;
  return (
    <tr className={"character " + wowData.validateName(className)}>
      <td>{name}</td>
      <td>{className}</td>
      <td>{spec}</td>
      <td>{level}</td>
      <td>{iLvl}</td>
      <td>{rank}</td>
    </tr>
  );
}
