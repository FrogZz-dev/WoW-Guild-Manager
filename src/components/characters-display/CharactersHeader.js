import React from "react";
import HeaderCell from "./HeaderCell";
import { useFilters } from "@contexts/FiltersContext";

export default function CharactersHeader() {
  const { availableInfo } = useFilters();

  return (
    <thead>
      <tr>
        {availableInfo.map((info) => (
          <HeaderCell key={info.infoKey} info={info} />
        ))}
      </tr>
    </thead>
  );
}
