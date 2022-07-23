import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  convertUserToBoardMemberData,
  populateBoardDetailById,
} from "../firebase/firestore/boardRepository";
import { convertUserToWorkspaceMemberData } from "../firebase/firestore/workspaceRepository";
import { useAuth } from "./AuthProvider";

const BoardMembershipContext = createContext(null);

function BoardMembershipProvider({ children }) {
  const { boardId } = useParams();
  const { user } = useAuth();
  const [userIsWorkspaceMember, setUserIsWorkspaceMember] = useState(false);
  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [board, setBoard] = useState();

  useEffect(() => {
    const identifyUserMembership = async () => {
      if (user === null) {
        setUserIsMember(false);
        setUserIsAdmin(false);
        return;
      }

      const member = await convertUserToBoardMemberData(boardId, user.uid);
      if (member === null) {
        setUserIsMember(false);
        setUserIsAdmin(false);
        return;
      }
      setUserIsMember(true);
      setUserIsAdmin(member.isAdmin);
    };
    identifyUserMembership();
  }, [boardId, user]);

  useEffect(() => {
    const identifyWorkspaceMembership = async () => {
      await populateBoardDetailById(boardId, setBoard);

      const workspaceMember = await convertUserToWorkspaceMemberData(
        board?.workspaceId,
        user?.uid
      );

      if (workspaceMember === null) {
        setUserIsWorkspaceMember(false);
        return;
      }
      setUserIsWorkspaceMember(true);
    };
    identifyWorkspaceMembership();
  }, [user, boardId, board?.workspaceId]);

  let value = { userIsMember, userIsAdmin, userIsWorkspaceMember };

  return (
    <BoardMembershipContext.Provider value={value}>
      {children}
    </BoardMembershipContext.Provider>
  );
}

export default BoardMembershipProvider;

export function useBoardMembership() {
  return useContext(BoardMembershipContext);
}
