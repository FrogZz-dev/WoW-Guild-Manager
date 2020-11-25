import React from "react";
import { Col, Form } from "react-bootstrap";
import { useRoster } from "@contexts/RosterContext";
import { useFilters } from "@contexts/FiltersContext";
import wowData from "@utils/wowData";

export default function Filters() {
  const { classes } = useRoster();
  const {
    handleFilterChange,
    nameFilter,
    classFilter,
    rankFilter,
    maxLevelOnly,
  } = useFilters();

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId="nameFilter">
          <Form.Label className="text-light">Recherche :</Form.Label>
          <Form.Control
            type="search"
            size="sm"
            className="bg-dark text-light"
            value={nameFilter}
            onChange={handleFilterChange}
            placeholder="Recherche"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group as={Col} controlId="classFilter">
          <Form.Label className="text-light">Filtrer par classe :</Form.Label>
          <Form.Control
            as="select"
            size="sm"
            onChange={handleFilterChange}
            value={classFilter}
            className="bg-dark text-light"
          >
            <option value="">Toutes les classes</option>
            {classes.map((classe) => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="rankFilter">
          <Form.Label className="text-light">Filtrer par rang :</Form.Label>
          <Form.Control
            as="select"
            size="sm"
            onChange={handleFilterChange}
            value={rankFilter}
            className="bg-dark text-light"
          >
            <option value="">Tous les rangs</option>
            {wowData.rankList.map((rank) => (
              <option key={rank.name} value={rank.name}>
                {rank.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Group as={Col} controlId="maxLevelFilter">
        <Form.Check
          type="checkbox"
          onChange={handleFilterChange}
          value={maxLevelOnly}
          className="bg-dark text-light"
          label="Niveau max seulement"
        />
      </Form.Group>
    </Form>
  );
}
