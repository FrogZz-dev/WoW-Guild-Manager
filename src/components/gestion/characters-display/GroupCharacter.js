import React from "react";

export default function GroupCharacter({ characterInfo }) {
  return (
    <div className="w-15 border border-light p-3 m-2">
      {characterInfo?.name}
    </div>
  );
}
