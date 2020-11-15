import React, { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { auth, fireUsersFunctions } from "@utils/firebase";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [deletePrompt, setDeletePrompt] = useState(false);
  const { currentUser, userInfo, logout, deleteAccount } = useAuth();
  const passwordRef = useRef("");
  const history = useHistory();

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Erreur lors de la déconnexion");
    }
  };

  const handleEmailVerif = async () => {
    try {
      await currentUser.sendEmailVerification();
    } catch (err) {
      setError("Une erreur est survenue.");
      console.log(err);
    }
  };

  const handleDeleteClick = () => {
    console.log(userInfo);
    setDeletePrompt(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setError("");
      const userUid = currentUser.uid;
      await auth.signInWithEmailAndPassword(
        currentUser.email,
        passwordRef.current.value
      );
      await fireUsersFunctions.deleteUserAccount(userUid);
      await deleteAccount();
      setDeletePrompt(false);
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect");
      } else if (err.code === "auth/user-not-found") {
        setError("Email non reconnu");
      } else if (err.code === "auth/too-many-requests") {
        setError("Compte désactivé temporairement, réessayez plus tard !");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "Vous devez vous reconnecter avant de pouvoir supprimer votre compte."
        );
      } else {
        setError("Erreur lors de la suppression du compte");
        console.log(err);
      }
    }
  };

  const handleDeleteAbort = () => {
    setDeletePrompt(false);
  };

  return (
    <>
      {!currentUser.emailVerified && (
        <Alert
          variant="warning"
          className="d-flex align-items-center flex-column"
        >
          <p>Votre compte n'est pas vérifié, consultez vos email.</p>
          <Button variant="warning" onClick={handleEmailVerif}>
            Renvoyer l'email de confirmation
          </Button>
        </Alert>
      )}
      <Card
        bg="dark"
        text="white"
        border="warning"
        className="w-100"
        style={{ maxWidth: "650px" }}
      >
        <Card.Body>
          <h2 className="text-center mb-4">Profil</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>
            <strong>Pseudo: </strong> {currentUser.displayName}
          </p>
          <p>
            <strong>Email: </strong> {currentUser.email}
          </p>
          <p>
            <strong>Role: </strong> {userInfo?.role}
          </p>
          <p>
            <strong>Main: </strong> {userInfo?.mainCharacter}
          </p>
        </Card.Body>
      </Card>

      {!deletePrompt && (
        <div className="w-100 text-center">
          <Button
            variant="link"
            className="text-warning"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
          <Button
            variant="link"
            className="text-warning"
            onClick={handleDeleteClick}
          >
            Supprimer le compte
          </Button>
        </div>
      )}

      <Alert
        variant="danger"
        show={deletePrompt}
        className="mt-3"
        onClose={handleDeleteAbort}
        transition={false}
        dismissible
      >
        <Alert.Heading>Attention !</Alert.Heading>
        <p className="text-wrap" style={{ maxWidth: "400px" }}>
          Êtes-vous sûr de vouloir supprimer votre compte ?<br />
          (Cette action est irreversible)
        </p>
        <hr />
        <Form>
          <Form.Group>
            <Form.Label>
              Veuillez entrer votre mot de passe pour confirmer :
            </Form.Label>
            <Form.Control type="password" ref={passwordRef} />
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-around">
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Confirmer
          </Button>
          <Button variant="danger" onClick={handleDeleteAbort}>
            Annuler
          </Button>
        </div>
      </Alert>
    </>
  );
}
