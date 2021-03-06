import React from "react";
import { useRoster } from "@contexts/RosterContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function HeaderCell({ info }) {
  const { key, displayName } = info;
  const { sortingChange, sorting, isDescending } = useRoster();

  const handleSortChange = () => {
    sortingChange(key);
  };

  return (
    <th onClick={handleSortChange}>
      {displayName}{" "}
      {sorting === key ? (
        <FontAwesomeIcon
          icon={faSortDown}
          flip={isDescending ? "horizontal" : "vertical"}
        />
      ) : null}
    </th>
  );
}
