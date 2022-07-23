import React, { useEffect, useState } from "react";
import { populatePublicWorkspaceList } from "../../../firebase/firestore/workspaceRepository";
import WorkspaceItem from "../../../components/WorkspaceItem";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

export default function PublicWorkspaceList() {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchPublicWorkspaces = async () => {
      await populatePublicWorkspaceList(setWorkspaces);
    };
    fetchPublicWorkspaces();
  });

  return (
    <Container>
      {workspaces.map(workspace => (
        <WorkspaceItem key={workspace.id} workspace={workspace} />
      ))}
    </Container>
  );
}
