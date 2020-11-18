import React, { useState } from "react";
import CharactersDisplay from "../characters-display/CharactersDisplay";
import MembersRoutes from "../routes/MembersRoutes";

export default function Members() {
  const [lastClicked, setLastClicked] = useState();

  return (
    <>
      <MembersRoutes
        lastClicked={lastClicked}
        onCharacterClick={setLastClicked}
      />
      <CharactersDisplay onCharacterClick={setLastClicked} />
    </>
  );
}
