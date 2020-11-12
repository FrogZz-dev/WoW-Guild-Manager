import React from "react";
import { Alert } from "react-bootstrap";

export default function InfoMessage({ info }) {
  return (
    <>
      {info.message && (
        <Alert className="m-3" variant={info.type}>
          {info.message}
        </Alert>
      )}
    </>
  );
}
