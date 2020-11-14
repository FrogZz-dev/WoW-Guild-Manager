import React, { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function PasswordReset() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;

    try {
      setError("");
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Un message vient d'être envoyé vers votre adresse email.");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Cet email n'existe pas");
      } else {
        setError("Erreur lors de la réinitialisation");
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card bg="dark" text="white" border="warning">
        <Card.Body>
          <h2 className="text-center mb-4">Réinitialiser le mot de passe</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="abc@email.com"
                ref={emailRef}
                required
              />
            </Form.Group>

            <Button
              variant="warning"
              disabled={loading}
              type="submit"
              className="w-100 mt-3"
            >
              Réinitialiser
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="/login" className="text-warning">
              Annuler
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
