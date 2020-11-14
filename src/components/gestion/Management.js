import React, { useState } from "react";
import RosterProvider from "@contexts/RosterContext";
import CharactersDisplay from "./characters-display/CharactersDisplay";
import ManagementRoutes from "@components/routes/ManagementRoutes";

export default function Management() {
  const [lastClicked, setLastClicked] = useState({});

  return (
    <RosterProvider>
      <ManagementRoutes
        lastClicked={lastClicked}
        onCharacterClick={setLastClicked}
      />
      <CharactersDisplay onCharacterClick={setLastClicked} />
    </RosterProvider>
  );
}
