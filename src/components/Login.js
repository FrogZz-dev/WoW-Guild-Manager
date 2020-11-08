import React, { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const rememberRef = useRef();
  const history = useHistory();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const rememberMe = rememberRef.current.checked;

    try {
      setError("");
      setLoading(true);
      await login(email, password, rememberMe);
      history.push("/");
    } catch (err) {
      if (error.code === "auth/wrong-password") {
        setError("Mot de passe incorrect");
      } else if (error.code === "auth/user-not-found") {
        setError("Email non reconnu");
      } else {
        setError("Erreur lors de la connexion");
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Se connecter</h2>
          {error && <Alert variant="danger">{error}</Alert>}
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

            <Form.Group>
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              defaultChecked="true"
              id="rememberMe"
              ref={rememberRef}
              label="Se souvenir de moi"
            />

            <Button disabled={loading} type="submit" className="w-100 mt-3">
              Se connecter
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center">
        Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
      </div>
    </div>
  );
}
