import React, { useState } from "react";
import GroupCharacter from "../characters-display/GroupCharacter";
import { useRoster } from "@contexts/RosterContext";

export default function GroupDisplay() {
  const [group, setGroup] = useState([]);
  const { getCharacterById } = useRoster();
  const testGroup = [];
  const initTestGroup = (n) => {
    for (let i = 0; i < n; i++) {
      testGroup.push(getCharacterById(127884838));
    }
  };

  initTestGroup(5);
  return (
    <div
      className="w-100 d-flex justify-content-around align-items-start"
      style={{ minWidth: "400px" }}
    >
      {testGroup.map((character) => (
        <GroupCharacter characterInfo={character} />
      ))}
    </div>
  );
}
