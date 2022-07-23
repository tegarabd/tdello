import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthProvider";
import { createBoard } from "../../../firebase/firestore/boardRepository";

const Form = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export default function CreateBoardForm({ workspaceId }) {
  const [board, setBoard] = useState({
    title: "",
    description: "",
    visibility: "",
    isClosed: false,
    workspaceId,
  });

  const { user } = useAuth();

  const handleFieldChange = e => {
    setBoard({
      ...board,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      board.title === "" ||
      board.description === "" ||
      board.visibility === "" ||
      board.visibility === "select"
    ) {
      return;
    }
    await createBoard(user?.uid, user?.displayName, board);
    setBoard({
      title: "",
      description: "",
      visibility: "",
      isClosed: false,
      workspaceId,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <input
        id="title"
        type="text"
        name="title"
        onChange={handleFieldChange}
        placeholder="Title"
        required
        value={board.title}
      />
      <input
        id="description"
        type="text"
        name="description"
        onChange={handleFieldChange}
        placeholder="Description"
        required
        value={board.description}
      />
      <select
        id="visibility"
        name="visibility"
        onChange={handleFieldChange}
        value={board.visibility}
        required
      >
        <option value="select">Select</option>
        <option value="private">Private</option>
        <option value="workspace">Workspace Only</option>
        <option value="public">Public</option>
      </select>
      <input type="submit" value="Add" />
    </Form>
  );
}
