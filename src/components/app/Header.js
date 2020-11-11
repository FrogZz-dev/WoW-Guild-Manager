import React from "react";
import { Dropdown, Nav, Navbar, NavItem } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import "@styles/style.css";

export default function Header() {
  const { currentUser, logout } = useAuth();

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {}
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
          <Dropdown as={NavItem}>
            <Dropdown.Toggle as={NavItem} className="nav-link">
              Gestion
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-dark text-light">
              <Dropdown.Item as={NavLink} to="/management/browse">
                Parcourir
              </Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/management/groups">
                Groupes
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
              <NavLink className="nav-link" to="/profile">
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
