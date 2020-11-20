import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import GroupDisplay from "./GroupDisplay";
import { fireGroupsFunctions } from "../../utils/firebase";
import GroupSelector from "./GroupSelector";
import GroupControls from "./GroupControls";

export default function GroupsCard() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(undefined);
  const [groupsExists, setGroupsExists] = useState(false);

  const groupsLoad = async () => {
    const loadedGroups = await fireGroupsFunctions.getGroups();
    setGroups(loadedGroups);
    if (loadedGroups.length) {
      setSelectedGroup(loadedGroups[0]);
      setGroupsExists(true);
    } else {
      setSelectedGroup(undefined);
      setGroupsExists(false);
    }
  };
  useEffect(() => {
    groupsLoad();
  }, []);

  const getGroupById = (id) => {
    const selectedGroup = groups.find((group) => group.id === id);
    return selectedGroup;
  };

  const handleGroupSelection = (e) => {
    console.log(e.target.value);
    setSelectedGroup(getGroupById(e.target.value));
  };

  const handleGroupDelete = async () => {
    await fireGroupsFunctions.deleteGroup(selectedGroup.id);
    await groupsLoad();
  };

  return (
    <Card
      bg="dark"
      border="warning"
      text="white"
      className="w-100 "
      style={{ maxWidth: "650px" }}
    >
      <Card.Header className="d-flex justify-content-around align-items-center">
        {!groupsExists && <p>Aucun groupe existant</p>}
        {groupsExists && (
          <GroupSelector
            groups={groups}
            selectedGroupId={selectedGroup?.id}
            onGroupSelection={handleGroupSelection}
          />
        )}
        <Link className="text-warning" to="/groups/edit-group/new-group">
          <Button variant="warning">Créer un groupe</Button>
        </Link>
      </Card.Header>
      {groupsExists && (
        <>
          <Card.Body className="pl-2 pr-2">
            <Card.Title className="text-center">
              {selectedGroup?.name ?? ""}
            </Card.Title>
            <GroupDisplay groupCharactersList={selectedGroup?.characters} />
          </Card.Body>
          <Card.Footer>
            <GroupControls
              selectedGroup={selectedGroup}
              onDelete={handleGroupDelete}
            />
          </Card.Footer>
        </>
      )}
    </Card>
  );
}
