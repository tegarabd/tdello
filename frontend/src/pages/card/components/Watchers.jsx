import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthProvider";
import { populateBoardMemberListById } from "../../../firebase/firestore/boardRepository";
import {
  assignUserToCard,
  populateCardWatchersById,
  unassignUserToCard,
} from "../../../firebase/firestore/cardRepository";

const AssignWatcherWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Select = styled.select`
  background-color: aliceblue;
  border-radius: 100vmax;
  padding: 0 1rem;
`;

const WatcherWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function Watchers({ card }) {
  const { user } = useAuth();
  const { boardId, cardId } = useParams();
  const [watchers, setWatchers] = useState();
  const [boardMembers, setBoardMembers] = useState();
  const [memberId, setMemberId] = useState("select");

  useEffect(() => {
    const fetchBoardMembers = async () => {
      if (boardId) {
        populateBoardMemberListById(boardId, setBoardMembers);
      }
    };
    fetchBoardMembers();
  }, [boardId]);

  useEffect(() => {
    const fetcheCardWathcers = async () => {
      if (cardId) {
        populateCardWatchersById(cardId, setWatchers);
      }
    };
    fetcheCardWathcers();
  }, [cardId]);

  const handelOnChange = e => {
    setMemberId(e.target.value);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    if (memberId === "select") return;
    const member = boardMembers.filter(
      boardMember => boardMember.id === memberId
    )[0];
    await assignUserToCard(
      cardId,
      card.title,
      boardId,
      member.id,
      member.displayName
    );
  };

  const handleOnUnassign = async watcher => {
    await unassignUserToCard(cardId, watcher.id);
  };

  return (
    <div>
      <h3>Wathcers</h3>
      {!watchers && <p>Loading...</p>}
      {watchers &&
        watchers.map(watcher => (
          <WatcherWrapper key={watcher.id}>
            <p>{watcher.displayName}</p>
            {watcher.id !== user.uid && (
              <Button
                onClick={() => handleOnUnassign(watcher)}
                reversColor
                small
              >
                Unassign
              </Button>
            )}
          </WatcherWrapper>
        ))}
      <h4>Assing Watcher</h4>
      <AssignWatcherWrapper>
        <Select value={memberId} onChange={handelOnChange}>
          <option value="select">Select Member</option>
          {boardMembers &&
            boardMembers.map(boardMember => (
              <option key={boardMember.id} value={boardMember.id}>
                {boardMember.displayName}
              </option>
            ))}
        </Select>
        <Button onClick={handleOnSubmit}>Assign</Button>
      </AssignWatcherWrapper>
    </div>
  );
}

export default Watchers;
