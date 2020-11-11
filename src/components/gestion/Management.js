import React from "react";
import Switch from "react-bootstrap/esm/Switch";
import { Redirect, Route } from "react-router-dom";
import RosterProvider from "../../contexts/RosterContext";
import CharacterCard from "./CharacterCard";
import CharactersDisplay from "./characters_display/CharactersDisplay";
import GroupEditor from "./GroupEditor";

export default function Management() {
  return (
    <RosterProvider>
      <Switch>
        <Route exact path="/management">
          <Redirect to="/management/browser" />
        </Route>
        <Route path="/management/browser">
          <CharacterCard />
        </Route>
        <Route path="/management/groups">
          <GroupEditor />
        </Route>
      </Switch>

      <CharactersDisplay />
    </RosterProvider>
  );
}
