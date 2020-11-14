import React from "react";
import { Table } from "react-bootstrap";
import CharactersHeader from "./CharactersHeader";
import CharactersBody from "./CharactersBody";
import Filters from "./Filters";
import InfoDisplay from "./InfoDisplay";

export default function CharactersDisplay({ onCharacterClick }) {
  return (
    <>
      <Filters />
      <InfoDisplay />
      <div className="overflow-auto" style={{ maxHeight: "50vh" }}>
        <Table striped bordered hover variant="dark" className="overflow-auto">
          <CharactersHeader />
          <CharactersBody onCharacterClick={onCharacterClick} />
        </Table>
      </div>
    </>
  );
}
