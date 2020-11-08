import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Management from "./Management";

export default function TestsCompo() {
  const [error, setError] = useState("");

  /*const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedRealm = validateRealm();
    setError("");
    if (!selectedRealm) {
      setError("Ce serveur n'existe pas");
      return;
    }

    const guildName = validateGuildInput(guildRef.current.value);
    try {
      await wowData.getGuildRoster(region, selectedRealm.slug, guildName);
    } catch (err) {
      setError(err.message);
    }
  };

  const validateRealm = () => {
    const realmInput = realmRef.current.value;
    const realmExists = (realm) => {
      const realmName = realm.name["en_US"];
      return realmInput.toLowerCase() === realmName.toLowerCase();
    };

    return realmList.find(realmExists);
  };

   */

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Management />
    </>
  );
}
