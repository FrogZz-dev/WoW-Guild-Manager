import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import "@styles/style.css";

export default function Header() {
  const { currentUser, logout } = useAuth();

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
      variant="dark"
      className="w-100 mb-2"
      expand="sm"
      style={{ minWidth: "300px" }}
    >
      <Navbar.Brand href="/">WoW Guild Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="main-menu" />
      <Navbar.Collapse
        className="justify-content-between align-items-center"
        id="main-menu"
      >
        <Nav>
          <NavLink className="nav-link" exact to="/">
            Accueil
          </NavLink>
          <NavLink className="nav-link" exact to="/members/browse">
            Membres
          </NavLink>
          <NavLink className="nav-link" exact to="/groups">
            Groupes
          </NavLink>
        </Nav>

        {!currentUser && (
          <Nav>
            <Nav.Item>
              <NavLink className="nav-link" to="/login">
                Connexion
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink className="nav-link" to="/signup">
                Inscription
              </NavLink>
            </Nav.Item>
          </Nav>
        )}

        {currentUser && (
          <Nav>
            <Nav.Item>
              <NavLink className="nav-link" to="/">
                {currentUser.email}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={handleDisconnect} to="/disconnect">
                Déconnexion
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
