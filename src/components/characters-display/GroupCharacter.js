import React from "react";
import "@styles/groupCharacter.css";
import wowData from "@utils/wowData";
import { Spinner } from "react-bootstrap";

export default function GroupCharacter({ characterInfo }) {
  if (!characterInfo) return <Spinner animation="border" />;
  const addedClass = wowData.validateName(
    characterInfo?.className + "-group" ?? ""
  );
  return (
    <div className={`group-character ${addedClass}`}>{characterInfo?.name}</div>
  );
}
