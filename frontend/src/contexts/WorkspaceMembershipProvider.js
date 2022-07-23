import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertUserToWorkspaceMemberData } from "../firebase/firestore/workspaceRepository";
import { useAuth } from "./AuthProvider";

const WorksapceMembershipContext = createContext(null);

function WorkspaceMembershipProvider({ children }) {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const [userIsMember, setUserIsMember] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const identifyUserMembership = async () => {
      if (user === null) {
        setUserIsMember(false);
        setUserIsAdmin(false);
        return;
      }
      const member = await convertUserToWorkspaceMemberData(
        workspaceId,
        user.uid
      );
      if (member === null) {
        setUserIsMember(false);
        setUserIsAdmin(false);
        return;
      }
      setUserIsMember(true);
      setUserIsAdmin(member.isAdmin);
    };
    identifyUserMembership();
  }, [workspaceId, user]);

  let value = { userIsMember, userIsAdmin };

  return (
    <WorksapceMembershipContext.Provider value={value}>
      {children}
    </WorksapceMembershipContext.Provider>
  );
}

export default WorkspaceMembershipProvider;

export function useWorkspaceMembership() {
  return useContext(WorksapceMembershipContext);
}
