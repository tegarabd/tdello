import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import FullPageInfo from "../../../../components/FullPageInfo";
import { useAuth } from "../../../../contexts/AuthProvider";
import { useWorkspaceMembership } from "../../../../contexts/WorkspaceMembershipProvider";
import {
  addMember,
  getWorkspaceByInvitationLink,
  notifyAllMembers,
} from "../../../../firebase/firestore/workspaceRepository";

const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 2rem;
`;

function WorkspaceInvitation() {
  const { workspaceId, token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState();
  const { userIsMember } = useWorkspaceMembership();

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setWorkspace(await getWorkspaceByInvitationLink(workspaceId, token));
    };
    fetchWorkspaceData();
  }, [workspaceId, token]);

  useEffect(() => {
    if (workspace !== undefined) setLoading(false);
  }, [workspace]);

  const handleAcceptInvitation = async e => {
    e.preventDefault();
    await addMember(
      workspaceId,
      user.uid,
      { title: workspace.title },
      { displayName: user.displayName, isAdmin: false }
    );
    await notifyAllMembers(
      workspaceId,
      `${user.displayName} is joined ${workspace.title}`
    );
    navigate(`/workspaces/${workspaceId}`);
  };

  if (loading) {
    return (
      <FullPageInfo>
        <h2>Loading...</h2>
      </FullPageInfo>
    );
  } else if (
    !workspace ||
    (workspace && new Date(workspace.link.expiredDate) < new Date())
  ) {
    return (
      <FullPageInfo>
        <h1>Error!</h1>
        <h3>Invalid id or the invitation link already expired.</h3>
      </FullPageInfo>
    );
  } else if (userIsMember) {
    return <Navigate to={`/workspaces/${workspaceId}`} />;
  }

  return (
    <FullPageInfo>
      <h1>CHello!</h1>
      <p>
        You have been invited to join CHello Workspace <b>{workspace?.title}</b>
      </p>
      <ButtonWrapper>
        <Button onClick={handleAcceptInvitation}>Accept</Button>
        <Button reversColor onClick={() => navigate("/home")}>
          Reject
        </Button>
      </ButtonWrapper>
    </FullPageInfo>
  );
}

export default WorkspaceInvitation;
