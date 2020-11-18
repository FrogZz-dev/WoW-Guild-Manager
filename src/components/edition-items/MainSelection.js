import React from "react";
import { Form } from "react-bootstrap";

export default function MainSelection({ mainRef, altCharacters }) {
  return (
    <Form inline>
      <Form.Label>Main :</Form.Label>
      <Form.Control
        as="select"
        size="sm"
        ref={mainRef}
        className="bg-dark text-light"
      >
        {altCharacters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </Form.Control>
    </Form>
  );
}
