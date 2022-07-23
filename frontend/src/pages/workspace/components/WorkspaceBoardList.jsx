import React, { useEffect, useState } from "react";
import BoardItem from "../../../components/BoardItem";
import List from "../../../components/List";
import { populateWorkspaceBoardListById } from "../../../firebase/firestore/workspaceRepository";

function WorkspaceBoardList({ workspaceId }) {
  const [boards, setboards] = useState([]);

  useEffect(() => {
    const fetchWorkspaceBoardList = async () => {
      if (workspaceId)
        await populateWorkspaceBoardListById(workspaceId, setboards);
    };
    fetchWorkspaceBoardList();
  }, [workspaceId]);

  return (
    <div>
      <h2>Boards</h2>
      <List>
        {boards.map(board => (
          <BoardItem key={board.id} board={board} />
        ))}
      </List>
    </div>
  );
}

export default WorkspaceBoardList;
