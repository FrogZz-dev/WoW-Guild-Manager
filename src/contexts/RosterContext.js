/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from "react";
import wowData from "@utils/wowData";
import { fireFunctions } from "@utils/firebase";

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
  let sortType; // le typeof des données à trier pour determiner la méthode à utiliser

  const [isLoadingRoster, setIsLoadingRoster] = useState(true);
  const [errorList, setErrorList] = useState([""]);

  // infos contenues dans chaque personnage
  const availableInfo = [
    { key: "name", displayName: "Nom", type: "string" },
    { key: "className", displayName: "Classe", type: "string" },
    { key: "spec", displayName: "Spécialisation", type: "string" },
    { key: "level", displayName: "Niveau", type: "number" },
    { key: "iLvl", displayName: "iLvl", type: "number" },
    { key: "rank", displayName: "Rang", type: "string" },
  ];

  /**
   *  Gestion des filtres et du tri
   */

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

  // mise à jour des states de tri
  const sortingChange = (sortingCategory) => {
    if (sortingCategory === sorting) {
      setDescending((descending) => !descending);
    } else {
      setSorting(sortingCategory);
      setDescending(true);
    }
  };

  // retourne le type de données à trier
  const getSortType = () => {
    sortType = availableInfo.find((info) => info.key === sorting).type;
  };

  const sortCallback = (item1, item2) => {
    // methode de tri des nombres
    if (sortType === "number") {
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
    getSortType();

    setDisplayedCharacters((displayedCharacters) =>
      sortCharacters(displayedCharacters)
    );

    setDisplayableCharacters((displayableCharacters) =>
      sortCharacters(displayableCharacters)
    );
  }, [sorting, descending]);

  /**
   * Initialisation des données du roster
   */

  // chargement des infos complètes du roster
  async function loadRoster() {
    setIsLoadingRoster(true);
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
          const [memberData, { data }] = await Promise.all([
            wowData.getCharacterInfo(
              region,
              realm,
              rawCharacter.character.name
            ),
            fireFunctions.getMemberAltsById(rawCharacter.character.id),
          ]);
          /* const memberData = await wowData.getCharacterInfo(
            region,
            realm,
            rawCharacter.character.name
          );
          const { data } = fireFunctions.getMemberAltsById(memberData); */
          // création de la fiche du personnage
          const memberInfo = {
            id: rawCharacter.character.id,
            name: rawCharacter.character.name,
            rank: wowData.getRankById(rawCharacter.rank),
            level: rawCharacter.character.level,
            iLvl: memberData.average_item_level,
            className: memberData.character_class.name,
            spec: memberData.active_spec.name,
            alts: data ? data.characters : [],
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
    if (!isLoadingRoster) {
      setDisplayedCharacters(roster);
      setDisplayableCharacters(roster);
    }
  }, [isLoadingRoster]);

  /**
   * fonctions utilitaires
   */
  const getCharacterById = (id) => {
    return roster.find((character) => character.id === id);
  };

  /**
   * valeurs partagées du context
   */

  const values = {
    displayedCharacters,
    loadRoster,
    isLoadingRoster,
    filterCharacters,
    classes,
    availableInfo,
    sortingChange,
    sorting,
    descending,
    getCharacterById,
  };

  return (
    <RosterContext.Provider value={values}>{children}</RosterContext.Provider>
  );
}
