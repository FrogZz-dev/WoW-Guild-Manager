import React from "react";
import Switch from "react-bootstrap/esm/Switch";
import { Redirect, Route, useRouteMatch } from "react-router-dom";
import CharacterCard from "../members/alts-manager/CharacterCard";
import CharacterAltsEditor from "../members/alts-manager/CharacterAltsEditor";

export default function MembersRoutes({ lastClicked, onCharacterClick }) {
  const { path } = useRouteMatch();
  return (
    <Switch className="pl-0 w-100 d-flex justify-content-center">
      <Route exact path={`${path}`}>
        <Redirect to={`${path}/browse`} />
      </Route>
      <Route exact path={`${path}/browse`}>
        <CharacterCard
          lastCharacter={lastClicked}
          onCharacterClick={onCharacterClick}
        />
      </Route>
      <Route path={`${path}/edit-character/:characterId`}>
        <CharacterAltsEditor lastCharacter={lastClicked} />
      </Route>
    </Switch>
  );
}
