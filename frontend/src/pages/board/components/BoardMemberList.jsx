import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "../../../components/List";
import MemberItem from "../../../components/MemberItem";
import { populateBoardMemberListById } from "../../../firebase/firestore/boardRepository";

function BoardMemberList({ boardId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchBoardMemberList = async () => {
      if (boardId) await populateBoardMemberListById(boardId, setMembers);
    };
    fetchBoardMemberList();
  }, [boardId]);

  return (
    <div>
      <h2>Members <Link to='members'>⇗</Link> </h2>
      <List>
        {members.map(member => (
          <MemberItem key={member.id} member={member} />
        ))}
      </List>
    </div>
  );
}

export default BoardMemberList;
