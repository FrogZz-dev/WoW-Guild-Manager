import React, { createContext, useContext, useEffect, useState } from "react";
import wowData from "@utils/wowData";

const region = process.env.REACT_APP_BLIZZARD_REGION;
const realm = process.env.REACT_APP_BLIZZARD_REALM;
const guildName = process.env.REACT_APP_BLIZZARD_GUILD_NAME;

const RosterContext = createContext();

export const useRoster = () => {
  return useContext(RosterContext);
};

export default function RosterProvider({ children }) {
  // l'ensemble des personnages obtenu par l'api
  const [roster, setRoster] = useState([]);

  // personnages affichés, filtres inclus
  const [displayedCharacters, setDisplayedCharacters] = useState([]);

  // personnages affichables, ceux qui n'ont pas été retiré par un click
  const [displayableCharacters, setDisplayableCharacters] = useState([]);

  // classes jouables
  const [classes, setClasses] = useState([]);

  // gestion du tri
  const [sorting, setSorting] = useState("name");
  const [descending, setDescending] = useState(true);

  const [isLoadingRoster, setIsLoadingRoster] = useState(true);
  const [errorList, setErrorList] = useState([""]);

  // infos contenues dans chaque personnage
  const availableInfo = [
    { tag: "name", displayName: "Nom", type: "string" },
    { tag: "className", displayName: "Classe", type: "string" },
    { tag: "spec", displayName: "Spécialisation", type: "string" },
    { tag: "level", displayName: "Niveau", type: "number" },
    { tag: "iLvl", displayName: "iLvl", type: "number" },
    { tag: "rank", displayName: "Rang", type: "string" },
  ];

  // application des filtres
  const filterCharacters = ({ nameFilter, selectedClass, selectedRank }) => {
    let tempDisplay = [...displayableCharacters];

    if (selectedClass) {
      tempDisplay = tempDisplay.filter(
        (character) => character.className === selectedClass
      );
    }

    if (selectedRank) {
      tempDisplay = tempDisplay.filter(
        (character) => character.rank === selectedRank
      );
    }

    if (nameFilter) {
      const regex = new RegExp(nameFilter, "i");

      tempDisplay = tempDisplay.filter(
        (character) => character.name.search(regex) > -1
      );
    }
    setDisplayedCharacters(tempDisplay);
  };

  const sortingChange = (sortingCategory) => {
    if (sortingCategory === sorting) {
      setDescending((descending) => !descending);
    } else {
      setSorting(sortingCategory);
      setDescending(true);
    }
  };

  const getSortType = () => {
    return availableInfo.find((info) => info.tag === sorting).type;
  };

  const sortCallback = (item1, item2) => {
    // methode de tri des nombres
    if (getSortType() === "number") {
      if (descending) {
        return item2[sorting] - item1[sorting];
      }
      return item1[sorting] - item2[sorting];
    }

    // méthode de tri des strings
    if (descending) {
      return item1[sorting].localeCompare(item2[sorting]);
    }
    return item2[sorting].localeCompare(item1[sorting]);
  };

  const sortCharacters = (charactersToSort) => {
    if (charactersToSort.length > 0) {
      const tempCharacters = [...charactersToSort];
      tempCharacters.sort(sortCallback);
      return tempCharacters;
    }

    return [];
  };

  // application du changement d'ordre
  useEffect(() => {
    console.log(
      `Sorting by ${sorting}, ${descending ? "descending" : "ascending"}`
    );
    setDisplayedCharacters((displayedCharacters) =>
      sortCharacters(displayedCharacters)
    );

    setDisplayableCharacters((displayableCharacters) =>
      sortCharacters(displayableCharacters)
    );
  }, [sorting, descending]);

  // chargement des infos complètes du roster
  async function loadRoster() {
    // récupération de la liste des membres
    const rawRosterData = await wowData.getGuildRoster(
      region,
      realm,
      guildName
    );

    const newRoster = [];
    // Promise.all pour attendre la fin du map
    Promise.all(
      rawRosterData.map(async (rawCharacter) => {
        try {
          // récupération des infos d'un personnage
          const memberData = await wowData.getCharacterInfo(
            region,
            realm,
            rawCharacter.character.name
          );

          // création de la fiche du personnage
          const memberInfo = {
            id: rawCharacter.character.id,
            name: rawCharacter.character.name,
            rank: wowData.getRankById(rawCharacter.rank),
            level: rawCharacter.character.level,
            iLvl: memberData.average_item_level,
            className: memberData.character_class.name,
            spec: memberData.active_spec.name,
          };

          // ajout du personnage à la liste
          newRoster.push(memberInfo);
        } catch {
          setErrorList((errorList) => [
            ...errorList,
            rawCharacter.character.name,
          ]);
        }
      })
    ).then(() => {
      newRoster.sort((a, b) => a.name.localeCompare(b.name));
      setRoster(newRoster);
      setIsLoadingRoster(false);
    });
  }

  //chargement des classes
  async function loadClasses() {
    const rawClasses = await wowData.getClassesList(region);

    rawClasses.classes.map((classe) =>
      setClasses((classes) => [...classes, classe.name])
    );
  }

  async function initData() {
    try {
      // création du token d'accès
      await wowData.setToken();
      await loadRoster();
      await loadClasses();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initData();
  }, []);

  // initialisation des states d'affichage
  useEffect(() => {
    setDisplayedCharacters(roster);
    setDisplayableCharacters(roster);
  }, [isLoadingRoster]);

  const values = {
    displayedCharacters,
    isLoadingRoster,
    filterCharacters,
    classes,
    availableInfo,
    sortingChange,
  };

  return (
    <RosterContext.Provider value={values}>{children}</RosterContext.Provider>
  );
}
