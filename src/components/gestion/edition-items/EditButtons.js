import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function EditButtons({ onSave }) {
  return (
    <div className="d-flex justify-content-around">
      <Button onClick={onSave} variant="warning">
        Enregistrer
      </Button>
      <Link to="/management/browse">
        <Button variant="warning">Retour</Button>
      </Link>
    </div>
  );
}
