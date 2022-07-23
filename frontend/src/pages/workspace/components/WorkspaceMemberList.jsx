import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../../../components/List";
import MemberItem from "../../../components/MemberItem";
import { populateWorkspaceMemberListById } from "../../../firebase/firestore/workspaceRepository";

function WorkspaceMemberList({ workspaceId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchWorkspaceMemberList = async () => {
      if (workspaceId)
        await populateWorkspaceMemberListById(workspaceId, setMembers);
    };
    fetchWorkspaceMemberList();
  }, [workspaceId]);

  return (
    <div>
      <h2>
        Members <Link to="members">⇗</Link>
      </h2>
      <List>
        {members.map(member => (
          <MemberItem key={member.id} member={member} />
        ))}
      </List>
    </div>
  );
}

export default WorkspaceMemberList;
