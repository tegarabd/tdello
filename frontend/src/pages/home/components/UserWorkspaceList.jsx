import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import { populateUserWorkspaceList } from "../../../firebase/firestore/userRepository";
import WorkspaceItem from "../../../components/WorkspaceItem";
import List from "../../../components/List";

export default function UserWorkspaceList() {
  const [workspaces, setWorkspaces] = useState();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchWorkspaceFromRepository = async () => {
      if (user) {
        populateUserWorkspaceList(user.uid, setWorkspaces);
      }
    };
    fetchWorkspaceFromRepository();
  }, [user]);

  useEffect(() => {
    if (workspaces !== undefined) setLoading(false);
  }, [workspaces]);

  if (loading) {
    return <h3>Loading Workspace...</h3>;
  }

  return (
    <>
      {workspaces.length === 0 ? (
        <h3>No Workspace yet...</h3>
      ) : (
        <List>
          {workspaces.map(workspace => (
            <WorkspaceItem key={workspace.id} workspace={workspace} />
          ))}
        </List>
      )}
    </>
  );
}
