import React from "react";
import { Form } from "react-bootstrap";

export default function Filters({ onInput, onOrder }) {
  const handleInputChange = (e) => {
    onInput(e.target.value);
  };

  const handleSelectChange = (e) => {
    onOrder(e.target.value);
  };

  return (
    <Form>
      <Form.Control
        type="search"
        placeholder="Chercher"
        onChange={handleInputChange}
      />

      <Form.Control as="select" defaultValue="" onChange={handleSelectChange}>
        <option value="">A->Z</option>
        <option value="level">Level</option>
        <option value="className">Classe</option>
        <option value="iLvl">iLvl</option>
        <option value="rank">Rang</option>
      </Form.Control>
    </Form>
  );
}
