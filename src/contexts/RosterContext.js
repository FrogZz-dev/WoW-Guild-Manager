import React, { createContext, useContext, useEffect, useState } from "react";
import wowData from "../utils/wowData";

const region = process.env.REACT_APP_BLIZZARD_REGION;
const realm = process.env.REACT_APP_BLIZZARD_REALM;
const guildName = process.env.REACT_APP_BLIZZARD_GUILD_NAME;

const RosterContext = createContext();

export const useRoster = () => {
  return useContext(RosterContext);
};

export default function RosterProvider({ children }) {
  const [roster, setRoster] = useState([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(true);
  const [errorList, setErrorList] = useState([]);
  const values = { roster, isLoadingRoster };

  // charcgement des infos complètes du roster
  useEffect(() => {
    const loadRoster = async () => {
      // création du token d'accès
      await wowData.setToken();

      // récupération de la lste des membres
      const rawRosterData = await wowData.getGuildRoster(
        region,
        realm,
        guildName
      );

      await rawRosterData.map(async (rawCharacter) => {
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
            rank: rawCharacter.rank,
            level: rawCharacter.character.level,
            iLvl: memberData.average_item_level,
            className: memberData.character_class.name.fr_FR,
            spec: memberData.active_spec.name.fr_FR,
          };

          // ajout du personnage à la liste
          setRoster((roster) => [...roster, memberInfo]);
        } catch {
          setErrorList((errorList) => [
            ...errorList,
            rawCharacter.character.name,
          ]);
        }
      });
    };
    loadRoster();
  }, []);
  return (
    <RosterContext.Provider value={values}>{children}</RosterContext.Provider>
  );
}
