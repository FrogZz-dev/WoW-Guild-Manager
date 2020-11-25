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
  const [roster, setRoster] = useState([]); // array d'objets {id (depuis l'API),name,ranklevel,iLvl,className,spec}
  const [rosterAlts, setRosterAlts] = useState([]); // array d'objets {id (du doc sur firestore), altsData: [{id (identique aux id Roster), name, className}]}

  // classes jouables
  const [classes, setClasses] = useState([]);

  const [isLoadingRoster, setIsLoadingRoster] = useState(true);

  /**
   * Initialisation des données du roster
   */

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
          };

          // ajout du personnage à la liste
          newRoster.push(memberInfo);
        } catch (error) {
          console.error(error.message);
        }
      })
    ).then(() => {
      setRoster(newRoster);
    });
  }

  //chargement des alts et stockage
  async function loadAlts() {
    const membersAltsData = await fireAltsFunctions.getAllMembers();
    setRosterAlts(membersAltsData);
  }

  //chargement des classes
  async function loadClasses() {
    const rawClasses = await wowData.getClassesList(region);

    rawClasses.classes.map((classe) =>
      setClasses((classes) => [...classes, classe.name])
    );
  }

  async function initData() {
    setIsLoadingRoster(true);
    try {
      // création du token d'accès
      await wowData.setToken();
      await Promise.all([loadRoster(), loadClasses()]);
      await loadAlts();
    } catch (error) {
      console.error(error);
    }
    setIsLoadingRoster(false);
  }

  useEffect(() => {
    initData();
  }, []);

  /**
   * fonctions utilitaires
   */
  const getCharacterById = (id) => {
    return roster.find((character) => character.id === id);
  };

  const getAltsByCharacterId = (characterId) => {
    rosterAlts.find((memberAlts) =>
      memberAlts.altsData.characters.some(
        (character) => character.id === characterId
      )
    );
  };

  const sortRoster = (sortCallback) => {
    if (roster.length > 0) {
      const tempRoster = [...roster];
      tempRoster.sort(sortCallback);
      setRoster(tempRoster);
    } else {
      setRoster([]);
    }
  };

  /**
   * valeurs partagées du context
   */
  const values = {
    roster,
    setRoster,
    isLoadingRoster, // l'état de chargement (boolean)
    classes, // liste des classes jouables (array)
    getCharacterById, // paramètre: id (number) => character (object)
    getAltsByCharacterId,
    sortRoster,
  };

  return (
    <RosterContext.Provider value={values}>{children}</RosterContext.Provider>
  );
}
