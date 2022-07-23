import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FullPageInfo from "../components/FullPageInfo";
import { useBoardMembership } from "../contexts/BoardMembershipProvider";
import { populateBoardDetailById } from "../firebase/firestore/boardRepository";
import { populateWorkspaceDetailById } from "../firebase/firestore/workspaceRepository";

function BoardMiddleware({ children }) {
  const { userIsMember, userIsWorkspaceMember } = useBoardMembership();
  const { boardId } = useParams();
  const [board, setboard] = useState();
  const [workspace, setWorkspace] = useState();

  useEffect(() => {
    const fetchboardMetadata = async () => {
      if (boardId) {
        populateBoardDetailById(boardId, setboard);
      }
    };

    fetchboardMetadata();
  }, [boardId]);

  useEffect(() => {
    const fetchWorkspaceMetadata = async () => {
      if (board?.workspaceId) {
        populateWorkspaceDetailById(board.workspaceId, setWorkspace);
      }
    };

    fetchWorkspaceMetadata();
  }, [board?.workspaceId]);

  if (board && board.visibility === "private" && !userIsMember) {
    return (
      <FullPageInfo>
        <h2>Oops...</h2>
        <h3>This board is board-visible (private)</h3>
        <h3>You are not allowed to view this board</h3>
        <Link className="link" to="/home">
          <h3 className="linkTitle">Home</h3>
        </Link>
      </FullPageInfo>
    );
  }

  if (board && board.visibility === "workspace" && !userIsWorkspaceMember) {
    return (
      <FullPageInfo>
        <h2>Oops...</h2>
        <h3>This board is workspace-visible</h3>
        <h3>You are not allowed to view this board</h3>
        <Link className="link" to="/home">
          <h3 className="linkTitle">Home</h3>
        </Link>
      </FullPageInfo>
    );
  }

  if (workspace && workspace.visibility === 'private' && !userIsWorkspaceMember) {
    return (
      <FullPageInfo>
        <h2>Oops...</h2>
        <h3>This board is in private workspace</h3>
        <h3>You are not allowed to view this board</h3>
        <Link className="link" to="/home">
          <h3 className="linkTitle">Home</h3>
        </Link>
      </FullPageInfo>
    );
  }

  return children;
}

export default BoardMiddleware;
