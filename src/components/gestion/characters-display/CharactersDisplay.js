import React from "react";
import { Spinner, Table } from "react-bootstrap";
import CharactersHeader from "./CharactersHeader";
import CharactersBody from "./CharactersBody";
import Filters from "./Filters";
import InfoDisplay from "./InfoDisplay";
import { useRoster } from "@contexts/RosterContext";

export default function CharactersDisplay({ onCharacterClick }) {
  const { isLoadingRoster } = useRoster();

  return (
    <div id="character-display" className="w-100">
      <Filters />
      <InfoDisplay />
      <div
        className="overflow-auto d-flex justify-content-center"
        style={{ maxHeight: "50vh", minHeight: "100px" }}
      >
        {isLoadingRoster && (
          <Spinner className="mt-5" animation="border" variant="warning" />
        )}
        {!isLoadingRoster && (
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="overflow-auto text-md-break"
          >
            <CharactersHeader />
            <CharactersBody onCharacterClick={onCharacterClick} />
          </Table>
        )}
      </div>
    </div>
  );
}
