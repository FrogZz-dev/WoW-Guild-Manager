import React from "react";
import { Form } from "react-bootstrap";

export default function GroupSelector({
  groups,
  selectedGroupId,
  onGroupSelection,
}) {
  return (
    <Form.Group controlId="group-selector">
      <Form.Label>Groupes : </Form.Label>

      <Form.Control
        as="select"
        size="sm"
        className="bg-dark text-light"
        value={selectedGroupId}
        onChange={onGroupSelection}
      >
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}
