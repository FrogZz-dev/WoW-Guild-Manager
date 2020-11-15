/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from "react";
import wowData from "@utils/wowData";
import { fireAltsFunctions } from "@utils/firebase";

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
  const [isDescending, setIsDescending] = useState(true);
  const [filters, setFilters] = useState({
    nameFilter: "",
    selectedClass: "",
    selectedRank: "",
  });

  const [isLoadingRoster, setIsLoadingRoster] = useState(true);

  // active le filtre sur la page de gesion des alts
  const [isAltFiltered, setIsAltFiltered] = useState(false);

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
  const filterCharacters = () => {
    let tempDisplay = [...displayableCharacters];
    const { nameFilter, selectedClass, selectedRank } = filters;

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

  useEffect(() => {
    filterCharacters();
  }, [filters, displayableCharacters]);

  // mise à jour des states de tri
  const sortingChange = (sortingCategory) => {
    if (sortingCategory === sorting) {
      setIsDescending((isDescending) => !isDescending);
    } else {
      setSorting(sortingCategory);
      setIsDescending(true);
    }
  };

  // retourne le type des données à trier
  const getSortType = () => {
    return availableInfo.find((info) => info.key === sorting).type;
  };

  // fonction appliqué par la méthode "sort"
  const sortCallback = (item1, item2) => {
    // methode de tri des nombres
    if (getSortType() === "number") {
      if (isDescending) {
        return item2[sorting] - item1[sorting];
      }
      return item1[sorting] - item2[sorting];
    }

    // méthode de tri des strings
    if (isDescending) {
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

    setDisplayableCharacters((displayableCharacters) =>
      sortCharacters(displayableCharacters)
    );
  }, [sorting, isDescending]);

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
          const [memberData, { altsData }] = await Promise.all([
            wowData.getCharacterInfo(
              region,
              realm,
              rawCharacter.character.name
            ),
            fireAltsFunctions.getMemberAltsById(rawCharacter.character.id),
          ]);

          if (memberData === undefined) {
            throw new Error(
              `Impossible de récupérer les informations de ${rawCharacter.character.name}`
            );
          }

          // création de la fiche du personnage
          const memberInfo = {
            id: rawCharacter.character.id,
            name: rawCharacter.character.name,
            rank: wowData.getRankById(rawCharacter.rank),
            level: rawCharacter.character.level,
            iLvl: memberData.average_item_level,
            className: memberData.character_class.name,
            spec: memberData.active_spec.name,
            alts: altsData ? altsData.characters : [],
          };

          // ajout du personnage à la liste
          newRoster.push(memberInfo);
        } catch (error) {
          console.error(error.message);
        }
      })
    ).then(() => {
      setRoster(sortCharacters(newRoster));
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

  // copie les membres du roster
  const updateDisplayable = () => {
    // filtre les personnages qui ont déjà des alts liés
    if (isAltFiltered) {
      setDisplayableCharacters(
        roster.filter((character) => character.alts.length === 0)
      );
    } else {
      setDisplayableCharacters(roster);
    }
  };

  async function initData() {
    try {
      // création du token d'accès
      await wowData.setToken();
      await Promise.all([loadRoster(), loadClasses()]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    initData();
  }, []);

  // initialisation des states d'affichage
  useEffect(() => {
    if (!isLoadingRoster) {
      updateDisplayable();
    }
  }, [isLoadingRoster, isAltFiltered]);

  /**
   * fonctions utilitaires
   */
  const getCharacterById = (id) => {
    return roster.find((character) => character.id === id);
  };

  /**
   * valeurs partagées du context
   */
  const displayInfo = {
    displayedCount: displayedCharacters.length,
    displayableCount: displayableCharacters.length,
    isAltFiltered,
  };

  const values = {
    displayedCharacters, // les personnages à afficher (array)
    loadRoster, // l'initialisation du roster (fonction sans paramètre)
    isLoadingRoster, // l'état de chargement (boolean)
    setFilters, // la mise à jour des filtres de tri (fonction, paramètre : {nameFilter:"", selectedClass: "",selectedRank: ""}
    classes, // liste des classes jouables (array)
    availableInfo, // liste des infos à afficher (array)
    sortingChange, // mise à jour du tri (fonction sans paramètre)
    sorting, // le caractère de tri (string), utile pour l'affichage
    isDescending, // l'ordre de tri (boolean), utile pour l'affichage
    getCharacterById, // paramètre: id (number) => character (object)
    setIsAltFiltered, // toggle le filtre des personnages ayant un alt
    displayInfo,
  };

  return (
    <RosterContext.Provider value={values}>{children}</RosterContext.Provider>
  );
}
