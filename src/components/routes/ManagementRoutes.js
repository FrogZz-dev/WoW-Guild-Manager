import React from "react";
import Switch from "react-bootstrap/esm/Switch";
import { Redirect, Route, useRouteMatch } from "react-router-dom";
import CharacterCard from "../gestion/alts-manager/CharacterCard";
import CharacterAltsEditor from "../gestion/alts-manager/CharacterAltsEditor";
import GroupsCard from "../gestion/groups-manager/GroupsCard";

export default function ManagementRoutes({ lastClicked, onCharacterClick }) {
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
        <CharacterAltsEditor
          lastCharacter={lastClicked}
          setLastCharacter={onCharacterClick}
        />
      </Route>
      <Route path={`${path}/groups`}>
        <GroupsCard />
      </Route>
    </Switch>
  );
}
