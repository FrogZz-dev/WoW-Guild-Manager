import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function EditButtons({ onSave, returnPath }) {
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
  };
  return (
    <div className="d-flex justify-content-center">
      <Button
        onClick={handleSaveClick}
        variant="warning"
        className="m-2"
        disabled={isSaving}
      >
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
