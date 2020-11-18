import React from "react";
import Switch from "react-bootstrap/esm/Switch";
import { Route } from "react-router-dom";
import Dashboard from "../authentification/Dashboard";
import Login from "../authentification/Login";
import Signup from "../authentification/Signup";
import PasswordReset from "../authentification/PasswordReset";
import Members from "../members/Members";
import PrivateRoute from "./PrivateRoute";
import GroupsCard from "../groups/GroupsCard";
import GroupEditor from "../groups/GroupEditor";

export default function MainRoutes() {
  return (
    <Switch className="pl-0 w-100 d-flex align-items-center flex-column">
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={PasswordReset} />
      <Route path="/members" component={Members} />
      <Route exact path="/groups" component={GroupsCard} />
      <Route path="/groups/edit-group/:groupId" component={GroupEditor} />
    </Switch>
  );
}
