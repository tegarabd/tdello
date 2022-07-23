import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BoardCard from "../../../components/BoardCard";
import { populateWorkspaceBoardListById } from "../../../firebase/firestore/workspaceRepository";

const Table = styled.div`
  display: flex;
  gap: 1rem;
`;

function WorkspaceBoardTable({ workspaceId }) {
  const [boards, setboards] = useState([]);

  useEffect(() => {
    const fetchWorkspaceBoardTable = async () => {
      if (workspaceId)
        await populateWorkspaceBoardListById(workspaceId, setboards);
    };
    fetchWorkspaceBoardTable();
  }, [workspaceId]);

  return (
    <div>
      <h2>Boards</h2>
      <Table>
        {boards.map(board => (
          <BoardCard key={board.id} board={board} />
        ))}
      </Table>
    </div>
  );
}

export default WorkspaceBoardTable;
