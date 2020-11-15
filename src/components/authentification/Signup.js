import React, { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { fireUsersFunctions } from "@utils/firebase";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      setError("");
      setLoading(true);

      // creation de l'utilisateur, authentification Firebase
      const { user } = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );

      await Promise.all([
        // ajout des informations complémentaires par défaut
        fireUsersFunctions.createUserAccount(user),
        // envoi de l'email de vérif
        user.sendEmailVerification(),
      ]);

      // redirection vers l'accueil après 3s
      const redirectInterval = setInterval(() => {
        setSuccessMessage("");
        clearInterval(redirectInterval);
        history.push("/");
      }, 3000);
      setSuccessMessage("Compte créé avec succès, vous allez être redirigé.");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Cette email est déjà utilisé!");
      } else {
        setError("Erreur lors de la création du compte.");
        console.log(error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card bg="dark" text="white" border="warning">
        <Card.Body>
          <h2 className="text-center mb-4">Créer un compte</h2>

          {error && (
            <Alert className="text-center" variant="danger">
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert className="text-center" variant="success">
              {successMessage}
            </Alert>
          )}

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
