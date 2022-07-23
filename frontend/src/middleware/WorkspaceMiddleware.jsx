import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FullPageInfo from "../components/FullPageInfo";
import { useWorkspaceMembership } from "../contexts/WorkspaceMembershipProvider";
import { populateWorkspaceDetailById } from "../firebase/firestore/workspaceRepository";

function WorkspaceMiddleware({ children }) {
  const { userIsMember } = useWorkspaceMembership();
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState();

  useEffect(() => {
    const fetchWorkspaceMetadata = async () => {
      if (workspaceId) {
        populateWorkspaceDetailById(workspaceId, setWorkspace);
      }
    };

    fetchWorkspaceMetadata();
  }, [workspaceId]);

  if (workspace && workspace.visibility === "private" && !userIsMember) {
    return (
      <FullPageInfo>
        <h2>Oops...</h2>
        <h3>You are not allowed to view this workspace</h3>
        <Link className="link" to="/home">
          <h3 className="linkTitle">Home</h3>
        </Link>
      </FullPageInfo>
    );
  }

  return children;
}

export default WorkspaceMiddleware;
