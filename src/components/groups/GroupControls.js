import React, { useState } from "react";
import { Button } from "react-bootstrap";
import GroupDeletePrompt from "./GroupDeletePrompt";

export default function GroupControls({ selectedGroup, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handlePromptClose = () => {
    setIsDeleting(false);
  };

  const handleConfirmation = async () => {
    await onDelete(selectedGroup?.id);
    setIsDeleting(false);
  };

  return (
    <div className="d-flex justify-content-center">
      <Button variant="warning" className="ml-2 mr-2">
        Modifier
      </Button>
      <Button
        variant="warning"
        className="ml-2 mr-2"
        onClick={handleDeleteClick}
      >
        Supprimer
      </Button>

      <GroupDeletePrompt
        show={isDeleting}
        onClose={handlePromptClose}
        onConfirm={handleConfirmation}
        headerText={`Supprimer "${selectedGroup?.name}?"`}
      />
    </div>
  );
}
