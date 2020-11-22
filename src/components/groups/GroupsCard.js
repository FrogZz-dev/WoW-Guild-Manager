import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import GroupDisplay from "./GroupDisplay";
import { fireGroupsFunctions } from "../../utils/firebase";
import GroupSelector from "./GroupSelector";
import GroupControls from "./GroupControls";

import { useAuth } from "@contexts/AuthContext";

export default function GroupsCard() {
  const { isVerifiedOnline } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(undefined);
  const [groupsExists, setGroupsExists] = useState(false);
  const history = useHistory();

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
    setSelectedGroup(getGroupById(e.target.value));
  };

  const handleGroupDelete = async () => {
    await fireGroupsFunctions.deleteGroup(selectedGroup.id);
    await groupsLoad();
  };

  const handleGroupCreation = () => {
    history.push("/groups/edit-group/new-group");
  };

  return (
    <>
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
          {isVerifiedOnline() && (
            <Button variant="warning" onClick={handleGroupCreation}>
              Créer un groupe
            </Button>
          )}
        </Card.Header>
        {groupsExists && (
          <>
            <Card.Body className="pl-2 pr-2">
              <Card.Title className="text-center">
                {selectedGroup?.name ?? ""}
              </Card.Title>
              <GroupDisplay groupCharactersList={selectedGroup?.characters} />
            </Card.Body>
            {isVerifiedOnline() && (
              <Card.Footer>
                <GroupControls
                  selectedGroup={selectedGroup}
                  onDelete={handleGroupDelete}
                />
              </Card.Footer>
            )}
          </>
        )}
      </Card>
    </>
  );
}
