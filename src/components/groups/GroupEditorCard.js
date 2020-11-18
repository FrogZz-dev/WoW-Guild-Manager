import React from "react";
import { Card, Form } from "react-bootstrap";
import EditButtons from "../edition-items/EditButtons";
import GroupDisplay from "../groups/GroupDisplay";

export default function GroupEditorCard({
  onNameChange,
  groupName,
  groupCharacters,
  onSave,
}) {
  return (
    <Card bg="dark" border="warning" text="white">
      <Card.Header>
        <Form.Control
          type="text"
          size="sm"
          className="bg-dark text-light"
          placeholder="Nom du groupe"
          value={groupName}
          onChange={onNameChange}
        />
      </Card.Header>
      <Card.Body>
        <GroupDisplay groupCharactersList={groupCharacters} />
        <EditButtons onSave={onSave} returnPath="/groups" />
      </Card.Body>
    </Card>
  );
}
