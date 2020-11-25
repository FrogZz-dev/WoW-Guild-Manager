import React from "react";
import { useRoster } from "@contexts/RosterContext";

export default function InfoDisplay() {
  const { displayInfo } = useRoster();

  return (
    <div id="display-info" className="w-100 text-right text-light">
      Affichage de {displayInfo?.displayedCount} sur{" "}
      {displayInfo?.displayableCount} personnages
      {displayInfo?.isAltFiltered ? " (sans alt)" : ""}
    </div>
  );
}
