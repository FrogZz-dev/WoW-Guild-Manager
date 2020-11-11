import React from "react";
import HeaderCell from "./HeaderCell";
import { useRoster } from "@contexts/RosterContext";

export default function CharactersHeader() {
  const { availableInfo } = useRoster();

  return (
    <thead>
      <tr>
        {availableInfo.map((info) => (
          <HeaderCell info={info} />
        ))}
      </tr>
    </thead>
  );
}
