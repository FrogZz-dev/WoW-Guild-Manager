import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {}
  };

  return (
    <Navbar bg="" className="w-100" expand="md" style={{ minWidth: "300px" }}>
      <Navbar.Brand href="/">WoW Guild Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="main-menu" />
      <Navbar.Collapse
        className="d-flex justify-content-between align-items-end"
        id="main-menu"
      >
        <Nav>
          <NavLink className="nav-link" exact to="/">
            Accueil
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
