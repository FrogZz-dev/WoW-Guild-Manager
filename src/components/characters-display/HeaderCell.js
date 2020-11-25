import React from "react";
import { useFilters } from "@contexts/FiltersContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function HeaderCell({ info }) {
  const { infoKey, displayName } = info;
  const { handleSortChange, orderBy, isDescending } = useFilters();

  return (
    <th id={infoKey} onClick={handleSortChange}>
      {displayName}{" "}
      {orderBy === infoKey ? (
        <FontAwesomeIcon
          onClick={() => {}}
          icon={faSortDown}
          flip={isDescending ? "horizontal" : "vertical"}
        />
      ) : null}
    </th>
  );
}
