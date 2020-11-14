import React from "react";
import Switch from "react-bootstrap/esm/Switch";
import { Route } from "react-router-dom";
import Dashboard from "@components/authentification/Dashboard";
import Login from "@components/authentification/Login";
import Signup from "@components/authentification/Signup";
import PasswordReset from "@components/authentification/PasswordReset";
import Management from "@components/gestion/Management";
import PrivateRoute from "./PrivateRoute";

export default function MainRoutes() {
  return (
    <Switch className="pl-0 w-100 d-flex align-items-center flex-column">
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={PasswordReset} />
      <Route path="/management" component={Management} />
    </Switch>
  );
}
