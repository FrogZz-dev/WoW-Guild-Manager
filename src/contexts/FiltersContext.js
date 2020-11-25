import React, { createContext, useContext, useEffect, useState } from "react";
import { useRoster } from "@contexts/RosterContext";

const maxLevel = 60;

const FiltersContext = createContext();

export const useFilters = () => {
  return useContext(FiltersContext);
};

export default function FiltersProvider({ children }) {
  const [orderBy, setOrderBy] = useState("name");
  const [isDescending, setIsDescending] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const [maxLevelOnly, setMaxLevelOnly] = useState(false);

  const { sortRoster, isLoadingRoster } = useRoster();

  // infos contenues dans chaque personnage et utiles à l'affichage et au tri
  const availableInfo = [
    { infoKey: "name", displayName: "Nom", type: "string" },
    { infoKey: "className", displayName: "Classe", type: "string" },
    { infoKey: "spec", displayName: "Spécialisation", type: "string" },
    { infoKey: "level", displayName: "Niveau", type: "number" },
    { infoKey: "iLvl", displayName: "iLvl", type: "number" },
    { infoKey: "rank", displayName: "Rang", type: "string" },
  ];

  const validateInput = (input) => {
    const specialChar = new RegExp(/[/*|+'"`\\@()[\]{}$@&.:;<>]/, "g");
    return input.replace(specialChar, "");
  };

  const handleFilterChange = (e) => {
    const changedFilter = e.target.id;
    const newValue = e.target.value;

    switch (changedFilter) {
      case "nameFilter":
        setNameFilter(validateInput(newValue));
        break;
      case "classFilter":
        setClassFilter(newValue);
        break;
      case "rankFilter":
        setRankFilter(newValue);
        break;
      case "maxLevelFilter":
        setMaxLevelOnly((maxLevelOnly) => !maxLevelOnly);
        break;

      default:
        break;
    }
  };

  const applyFiltersCallback = (character) => {
    if (maxLevelOnly && character.level !== maxLevel) {
      return false;
    }

    if (nameFilter) {
      const regex = new RegExp(nameFilter, "i");

      if (character.name.search(regex) === -1) {
        return false;
      }
    }

    if (classFilter && character.className !== classFilter) {
      return false;
    }

    if (rankFilter && character.rank !== rankFilter) {
      return false;
    }

    return true;
  };

  /**
   *
   *  Fonctions de tri
   */

  // mise à jour des states de tri
  const sortUpdate = (sortCategory) => {
    if (sortCategory === orderBy) {
      setIsDescending((isDescending) => !isDescending);
    } else {
      setOrderBy(sortCategory);
      setIsDescending(true);
    }
  };

  // retourne le type des données à trier (depuis available info)
  const getSortType = () => {
    return availableInfo.find((info) => info.infoKey === orderBy).type;
  };

  // methode de tri des nombres
  const sortNumsCallback = (character1, character2) => {
    if (isDescending) {
      return character2[orderBy] - character1[orderBy];
    }
    return character1[orderBy] - character2[orderBy];
  };

  const sortStringsCallback = (character1, character2) => {
    // méthode de tri des strings
    if (isDescending) {
      return character1[orderBy].localeCompare(character2[orderBy]);
    }
    return character2[orderBy].localeCompare(character1[orderBy]);
  };

  const handleSortChange = (e) => {
    const clickedHeader = e.target.id;
    if (!clickedHeader) {
      return;
    }
    sortUpdate(clickedHeader);
  };

  useEffect(() => {
    if (!isLoadingRoster) {
      if (getSortType() === "number") {
        sortRoster(sortNumsCallback);
      } else {
        sortRoster(sortStringsCallback);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, isDescending, isLoadingRoster]);

  const values = {
    nameFilter,
    classFilter,
    rankFilter,
    maxLevelOnly,
    handleFilterChange,
    applyFiltersCallback,
    availableInfo,
    orderBy,
    isDescending,
    handleSortChange,
  };
  return (
    <FiltersContext.Provider value={values}>{children}</FiltersContext.Provider>
  );
}
