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
  const [errorList, setErrorList] = useState([""]);
  const values = { roster, isLoadingRoster };

  // charcgement des infos complètes du roster
  useEffect(() => {
    async function loadRoster() {
      // création du token d'accès
      await wowData.setToken();

      // récupération de la lste des membres
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
              rank: rawCharacter.rank,
              level: rawCharacter.character.level,
              iLvl: memberData.average_item_level,
              className: memberData.character_class.name,
              spec: memberData.active_spec.name,
            };

            // ajout du personnage à la liste
            newRoster.push(memberInfo);

            if (roster.length === rawRosterData.length - errorList.length) {
              setIsLoadingRoster(false);
            }
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

    loadRoster();
  }, []);
  return (
    <RosterContext.Provider value={values}>{children}</RosterContext.Provider>
  );
}
