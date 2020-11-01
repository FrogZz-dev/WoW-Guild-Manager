import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import wowData from "../utils/wowData";

export default function TestsCompo() {
  const [region, setRegion] = useState("eu");
  const [realmList, setRealmList] = useState([]);
  const [error, setError] = useState("");
  const realmRef = useRef();
  const guildRef = useRef();

  useEffect(() => {
    async function getData() {
      try {
        await wowData.setToken();
        setRealmList(await wowData.getRealmList(region));
      } catch (err) {
        setError(err.message);
      }
    }
    getData();
  }, [region]);

  const handleRegionChange = (e) => {
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
      await wowData.getGuildInfo(region, selectedRealm.slug, guildName);
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

  const validateGuildInput = (inputText) => {
    return inputText.toLowerCase().split(" ").join("-");
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group>
            <Form.Label>Region</Form.Label>
            <Form.Control
              as="select"
              onChange={handleRegionChange}
              defaultValue={region}
            >
              {wowData.regionList.map((region) => {
                return (
                  <option value={region.tag} key={region.tag}>
                    {region.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Serveur</Form.Label>
            <Form.Control type="text" list="realm-list" ref={realmRef} />
            <datalist id="realm-list">
              {realmList.map((realm) => {
                return <option>{realm.name["en_US"]}</option>;
              })}
            </datalist>
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>Guilde</Form.Label>
          <Form.Control type="text" ref={guildRef} />
        </Form.Group>

        <Button type="submit">Chercher</Button>
      </Form>
    </>
  );
}
