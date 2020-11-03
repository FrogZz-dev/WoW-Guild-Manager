import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import "../styles/character.css";
import wowData from "../utils/wowData";

export default function Character({ characterInfo }) {
  const { id, name, level, rank, className, spec, iLvl } = characterInfo;
  return (
    <OverlayTrigger
      trigger="click"
      key={id}
      placement="right"
      overlay={
        <Popover>
          <Popover.Title>{name}</Popover.Title>
          <Popover.Content>
            <div>
              <p>
                {className} {spec}
              </p>
              <p>Niveau {level}</p>
              <p>{iLvl} iLvl</p>
            </div>
          </Popover.Content>
        </Popover>
      }
    >
      <p className={"character " + wowData.validateName(className)}>{name}</p>
    </OverlayTrigger>
  );
}
