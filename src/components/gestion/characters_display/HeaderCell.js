import React from "react";
import { useRoster } from "@contexts/RosterContext";

export default function HeaderCell({ info }) {
  const { tag, displayName } = info;
  const { sortingChange } = useRoster();

  const handleSortChange = (e) => {
    sortingChange(e.target.id);
  };

  return (
    <th id={tag} onClick={handleSortChange}>
      {displayName}
    </th>
  );
}
