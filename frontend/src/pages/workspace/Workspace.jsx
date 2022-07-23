import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Template from "../../components/Template";
import { useWorkspaceMembership } from "../../contexts/WorkspaceMembershipProvider";
import {
  populateWorkspaceDetailById,
  updateWorkspace,
} from "../../firebase/firestore/workspaceRepository";
import CreateBoardForm from "./components/CreateBoardForm";
import WorkspaceBoardList from "./components/WorkspaceBoardList";
import WorkspaceBoardTable from "./components/WorkspaceBoardTable";
import WorkspaceMemberList from "./components/WorkspaceMemberList";

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Select = styled.select`
  width: 10rem;
  margin-right: 1rem;
`;

function Workspace() {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState();
  const [visibility, setVisibility] = useState();
  const { userIsMember, userIsAdmin } = useWorkspaceMembership();

  useEffect(() => {
    const fetchWorkspaceMetadata = async () => {
      if (workspaceId) {
        populateWorkspaceDetailById(workspaceId, setWorkspace);
      }
    };

    fetchWorkspaceMetadata();
  }, [workspaceId]);

  useEffect(() => {
    if (workspace) setVisibility(workspace.visibility);
  }, [workspace]);

  const handleVisibilityChange = e => {
    setVisibility(e.target.value);
  };

  const handleVisibilitySubmit = async e => {
    e.preventDefault();
    await updateWorkspace(workspaceId, { visibility });
  };

  return (
    <Template
      side={
        <Side>
          <Link className="link" to="/home">
            <h3 className="linkTitle">Home</h3>
          </Link>
          <WorkspaceBoardList workspaceId={workspaceId} />
          <WorkspaceMemberList workspaceId={workspaceId} />
        </Side>
      }
      main={
        <>
          <h2>{workspace?.title}</h2>
          <h4>{workspace?.description}</h4>
          <h4>
            {userIsAdmin ? (
              <form onSubmit={handleVisibilitySubmit}>
                <Select
                  disabled={!userIsAdmin}
                  id="visibility"
                  name="visibility"
                  onChange={handleVisibilityChange}
                  value={visibility}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </Select>
                <input type="submit" value="Change" />
              </form>
            ) : (
              visibility
            )}
          </h4>

          {userIsMember && (
            <>
              <h2>Add Board</h2>
              <CreateBoardForm />
            </>
          )}
          <WorkspaceBoardTable workspaceId={workspaceId} />
        </>
      }
    />
  );
}

export default Workspace;
