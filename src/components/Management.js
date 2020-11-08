import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import Switch from "react-bootstrap/esm/Switch";
import { Redirect, Route, useLocation } from "react-router-dom";
import { useRoster } from "../contexts/RosterContext";
import CharactersDisplay from "./CharactersDisplay";
import CharacterSheet from "./CharacterSheet";
import Filters from "./Filters";
import GroupCreation from "./GroupCreation";

export default function ManagementHandles() {
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  const location = useLocation();
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

    setIsInit(true);
  }, [isLoadingRoster]);

  // mis à jour de la liste des personnages à chaque changement de la recherche
  useEffect(() => {
    if (isInit) {
      if (searchInput) {
        const regex = new RegExp(searchInput, "i");
        setDisplayedCharacters(
          roster.filter((character) => character.name.search(regex) > -1)
        );
      } else setDisplayedCharacters(roster);
    }
    return () => {};
  }, [searchInput]);

  useEffect(() => {
    if (isInit) {
      const tempCharacters = [...displayedCharacters];
      tempCharacters.sort((a, b) => a.name.localeCompare(b.name));
      tempCharacters.sort(sortMethod);
      setDisplayedCharacters(tempCharacters);
    }
    return () => {};
  }, [order]);

  const handleSearch = (input) => {
    setSearchInput(input);
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
  };

  const handleCharacterClick = (character) => {
    if (location.pathname === "/management/browse") {
      setSelectedCharacters([character]);
    } else {
      if (!selectedCharacters.some((selected) => character.id === selected.id))
        setSelectedCharacters((selectedCharacters) => [
          ...selectedCharacters,
          character,
        ]);
    }
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
    <>
      <Col md={3}>
        <Filters onInput={handleSearch} onOrder={handleOrderChange} />

        <CharactersDisplay
          className="ml-50"
          characters={displayedCharacters}
          infoToDisplay={order}
          onCharacterClick={handleCharacterClick}
        />
      </Col>
      <Col>
        <Switch>
          <Route exact path="/management">
            <Redirect to="/management/browse" />
          </Route>
          <Route path="/management/browse">
            {roster[0] && (
              <CharacterSheet
                characterInfo={
                  selectedCharacters[0] ? selectedCharacters[0] : roster[0]
                }
              />
            )}
          </Route>
          <Route path="/management/groups">
            <GroupCreation
              characters={selectedCharacters}
              onCharacterClick={handleSelectedClick}
            />
          </Route>
        </Switch>
      </Col>
    </>
  );
}
