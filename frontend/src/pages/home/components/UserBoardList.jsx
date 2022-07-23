import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import BoardItem from "../../../components/BoardItem";
import { populateUserBoardList } from "../../../firebase/firestore/userRepository";
import List from "../../../components/List";

export default function UserBoardList() {
  const [boards, setBoards] = useState();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchBoardFromRepository = async () => {
      if (user) {
        populateUserBoardList(user.uid, setBoards);
      }
    };
    fetchBoardFromRepository();
  }, [user]);

  useEffect(() => {
    if (boards !== undefined) setLoading(false);
  }, [boards]);

  if (loading) {
    return <h3>Loading Boards...</h3>;
  }

  return (
    <>
      {boards.length === 0 ? (
        <h3>No Board yet...</h3>
      ) : (
        <List>
          {boards.map(board => (
            <BoardItem key={board.id} board={board} />
          ))}
        </List>
      )}
    </>
  );
}
