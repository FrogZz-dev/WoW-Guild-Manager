import React, { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("Erreur lors de la création du compte.");
    }
    setLoading(false);
  };

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card bg="dark" text="white" border="warning">
        <Card.Body>
          <h2 className="text-center mb-4">Créer un compte</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="abc@email.com"
                ref={emailRef}
              />
              <Form.Control.Feedback type="invalid">
                Entre une adresse eamil valide.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                ref={passwordRef}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                ref={passwordConfirmRef}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="warning"
              disabled={loading}
              type="submit"
              className="w-100 mt-3"
            >
              Créer le compte
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center text-light">
        Vous avez déjà un compte ?{" "}
        <Link to="/login" className="text-warning">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
