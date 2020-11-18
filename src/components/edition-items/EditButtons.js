import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function EditButtons({ onSave, returnPath }) {
  return (
    <div className="d-flex justify-content-center border-top">
      <Button onClick={onSave} variant="warning" className="m-2">
        Enregistrer
      </Button>
      <Link to={returnPath}>
        <Button variant="warning" className="m-2">
          Retour
        </Button>
      </Link>
    </div>
  );
}
