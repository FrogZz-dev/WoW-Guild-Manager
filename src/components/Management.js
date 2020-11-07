import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useRoster } from "../contexts/RosterContext";
import CharactersDisplay from "./CharactersDisplay";
import Filters from "./Filters";

export default function ManagementHandles() {
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const { isLoadingRoster, roster } = useRoster();

  const sortMethod = (a, b) => {
    switch (order) {
      case "level":
        return b.level - a.level;
      case "iLvl":
        return b.iLvl - a.iLvl;
      case "rank":
        return a.rank - b.rank;
      case "className":
        return a.className.localeCompare(b.className);
      default:
        return a.name.localeCompare(b.name);
    }
  };

  // initialisation de la liste à afficher une fois les données complétement chargées
  useEffect(() => {
    setDisplayedCharacters(roster);
  }, [isLoadingRoster]);

  // mis à jour de la liste des personnages à chaque changement de la recherche
  useEffect(() => {
    if (searchInput) {
      const regex = new RegExp(searchInput, "i");
      setDisplayedCharacters(
        roster.filter((character) => character.name.search(regex) > -1)
      );
    } else setDisplayedCharacters(roster);
    return () => {};
  }, [searchInput]);

  useEffect(() => {
    const tempCharacters = [...displayedCharacters];
    tempCharacters.sort((a, b) => a.name.localeCompare(b.name));
    tempCharacters.sort(sortMethod);
    setDisplayedCharacters(tempCharacters);
    return () => {};
  }, [order]);

  const handleSearch = (input) => {
    setSearchInput(input);
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
  };

  const handleCharacterClick = (character) => {
    if (!selectedCharacters.some((selected) => character.id === selected.id))
      setSelectedCharacters((selectedCharacters) => [
        ...selectedCharacters,
        character,
      ]);
  };

  const handleSelectedClick = (character) => {
    const tempSelected = [...selectedCharacters];
    tempSelected.splice(
      tempSelected.findIndex((selected) => selected.id === character.id),
      1
    );

    setSelectedCharacters(tempSelected);
  };

  return (
    <div
      className="w-100 d-flex justify-content-between align-items-auto p-25"
      style={{ height: "83vh" }}
    >
      <div className="w-25">
        <Filters onInput={handleSearch} onOrder={handleOrderChange} />
        <CharactersDisplay
          className="ml-50"
          characters={displayedCharacters}
          infoToDisplay={order}
          onCharacterClick={handleCharacterClick}
        />
      </div>
      <div className="d-flex align-items-center justify-content-center w-100 min-vh-80 ">
        <Card className="text-white bg-secondary">
          <Card.Body>
            <CharactersDisplay
              characters={selectedCharacters}
              onCharacterClick={handleSelectedClick}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
