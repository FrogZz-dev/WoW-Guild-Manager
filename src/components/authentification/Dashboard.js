import React, { useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const history = useHistory();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Erreur lors de la déconnexion");
    }
  };

  return (
    <>
      <Card bg="dark" text="white" border="warning">
        <Card.Body>
          <h2 className="text-center mb-4">Profil</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
        </Card.Body>
      </Card>
      <div className="w-100 text-center">
        <Button variant="link" className="text-warning" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>
    </>
  );
}
