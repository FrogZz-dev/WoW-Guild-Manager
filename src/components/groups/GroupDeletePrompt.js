import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function GroupDeletePrompt({
  show,
  onClose,
  onConfirm,
  headerText,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      contentClassName="bg-dark text-light border-warning"
      animation={false}
    >
      <Modal.Header className="border-secondary">
        <Modal.Title>{headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Cette action est irréversible</Modal.Body>
      <Modal.Footer className="border-secondary">
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="warning" onClick={onConfirm}>
          Confirmer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
