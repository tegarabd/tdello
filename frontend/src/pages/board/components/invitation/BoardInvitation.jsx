import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import FullPageInfo from "../../../../components/FullPageInfo";
import { useAuth } from "../../../../contexts/AuthProvider";
import { useBoardMembership } from "../../../../contexts/BoardMembershipProvider";
import {
  addMember as addBoardMember,
  getBoardByInvitationLink,
  notifyAllMembers,
} from "../../../../firebase/firestore/boardRepository";
import { addMember as addWorkspaceMember, populateWorkspaceDetailById } from "../../../../firebase/firestore/workspaceRepository";

const ButtonWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 2rem;
`;

function BoardInvitation() {
  const { boardId, token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [board, setboard] = useState();
  const { userIsMember } = useBoardMembership();
  const [workspace, setWorkspace] = useState()

  useEffect(() => {
    const fetchBoardData = async () => {
      setboard(await getBoardByInvitationLink(boardId, token));
    };
    fetchBoardData();
  }, [boardId, token]);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      await populateWorkspaceDetailById(board?.workspaceId, setWorkspace)
    }
    fetchWorkspaceData()
  }, [board?.workspaceId])

  useEffect(() => {
    if (board !== undefined) setLoading(false);
  }, [board]);

  const handleAcceptInvitation = async e => {
    e.preventDefault();
    await addWorkspaceMember(
      board.workspaceId,
      user.uid,
      {title: workspace.title},
      {displayName: user.displayName, isAdmin: false}
    )
    await addBoardMember(
      boardId,
      user.uid,
      { title: board.title },
      { displayName: user.displayName, isAdmin: false }
    );
    await notifyAllMembers(boardId, `${user.displayName} is joined ${board.title}`)
    navigate(`/boards/${boardId}`);
  };

  if (loading) {
    return (
      <FullPageInfo>
        <h2>Loading...</h2>
      </FullPageInfo>
    );
  } else if (!board || (board && new Date(board.link.expiredDate) < new Date())) {
    return (
      <FullPageInfo>
        <h1>Error!</h1>
        <h3>Invalid id or the invitation link already expired.</h3>
      </FullPageInfo>
    );
  } else if (userIsMember) {
    return <Navigate to={`/boards/${boardId}`} />;
  }

  return (
    <FullPageInfo>
      <h1>CHello!</h1>
      <p>
        You have been invited to join CHello board <b>{board?.title}</b>
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

export default BoardInvitation;
