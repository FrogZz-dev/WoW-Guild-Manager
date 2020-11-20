import React, { useRef } from "react";
import { Col, Form } from "react-bootstrap";
import { useRoster } from "@contexts/RosterContext";
import wowData from "@utils/wowData";

export default function Filters() {
  const { setFilters, classes } = useRoster();

  const searchInput = useRef();
  const classFilter = useRef();
  const rankFilter = useRef();

  const validateInput = (input) => {
    const specialChar = new RegExp(/[/*|+'"`\\@()[\]{}$@&.:;<>]/, "g");
    return input.replace(specialChar, "");
  };
  const handleFilterChange = () => {
    searchInput.current.value = validateInput(searchInput.current.value);
    const nameFilter = searchInput.current.value;
    const selectedClass = classFilter.current.value;
    const selectedRank = rankFilter.current.value;

    setFilters({ nameFilter, selectedClass, selectedRank });
  };

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId="searchFilter">
          <Form.Label className="text-light">Recherche :</Form.Label>
          <Form.Control
            type="search"
            size="sm"
            className="bg-dark text-light"
            onChange={handleFilterChange}
            ref={searchInput}
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
            ref={classFilter}
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
            ref={rankFilter}
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
    </Form>
  );
}
