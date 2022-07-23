import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import MemberItem from "../../../../components/MemberItem";
import Template from "../../../../components/Template";
import { useAuth } from "../../../../contexts/AuthProvider";
import { useWorkspaceMembership } from "../../../../contexts/WorkspaceMembershipProvider";
import {
  grantAdmin,
  populateWorkspaceMemberListById,
  removeMember,
  revokeAdmin,
} from "../../../../firebase/firestore/workspaceRepository";
import InviteMember from "./InviteMember";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Main = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70rem;
`;

function WorkspaceMembers() {
  const { workspaceId } = useParams();
  const [members, setMembers] = useState();
  const [member, setMember] = useState();
  const { user } = useAuth();
  const { userIsAdmin } = useWorkspaceMembership();

  useEffect(() => {
    const fetchWorkspaceMemberList = async () => {
      if (workspaceId)
        await populateWorkspaceMemberListById(workspaceId, setMembers);
    };
    fetchWorkspaceMemberList();
  }, [workspaceId]);

  const handleRemoveMember = (e, member) => {
    e.preventDefault();

    const isSure = window.confirm(
      `Are you sure to remove ${member.displayName}?`
    );

    if (!isSure) return;
    removeMember(workspaceId, member.id);
    setMember(null);
  };

  const handleRevokeAdmin = (e, member) => {
    e.preventDefault();

    const isSure = window.confirm(
      `Are you sure to revoke admin role from ${member.displayName}?`
    );

    if (!isSure) return;
    revokeAdmin(workspaceId, member.id);
    setMember({ ...member, isAdmin: false });
  };

  const handleGrantAdmin = (e, member) => {
    e.preventDefault();

    const isSure = window.confirm(
      `Are you sure to grant admin role to ${member.displayName}?`
    );

    if (!isSure) return;
    grantAdmin(workspaceId, member.id);
    setMember({ ...member, isAdmin: true });
  };

  return (
    <Template
      side={
        <Container>
          <Link className="link" to={`/workspaces/${workspaceId}`}>
            <h3 className="linkTitle">Workspace</h3>
          </Link>
          {members === undefined && <h3>Loading...</h3>}
          {members && (
            <Container>
              <h3>Members</h3>
              {members.map(member => (
                <MemberItem
                  key={member.id}
                  member={member}
                  onClick={() => setMember(member)}
                />
              ))}
            </Container>
          )}
        </Container>
      }
      main={
        <Main>
          <div>
            {!member && <h3>Select Member</h3>}
            {member && (
              <div>
                <h3>{member.displayName}</h3>
                {member.isAdmin ? (
                  <div>
                    <h4>Admin</h4>
                    {member.id === user.uid && <h4>You</h4>}
                    {member.id !== user.uid && userIsAdmin && (
                      <Button
                        reversColor
                        onClick={e => handleRevokeAdmin(e, member)}
                      >
                        Revoke Admin
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4>Member</h4>
                    {member.id === user.uid && <h4>You</h4>}
                    {member.id !== user.uid && userIsAdmin && (
                      <>
                        <Button onClick={e => handleGrantAdmin(e, member)}>
                          Grant Admin
                        </Button>
                        <Button
                          reversColor
                          onClick={e => handleRemoveMember(e, member)}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {userIsAdmin && <InviteMember />}
        </Main>
      }
    />
  );
}

export default WorkspaceMembers;
