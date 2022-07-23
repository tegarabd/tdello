import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthProvider";
import { createBoard } from "../../../firebase/firestore/boardRepository";
import { populateUserWorkspaceList } from "../../../firebase/firestore/userRepository";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 1rem;
  gap: 2rem;
  background-color: aliceblue;
`;

const SubmitButton = styled.input`
  align-self: flex-end;
`;

export default function CreateBoardForm() {
  const [board, setBoard] = useState({
    title: "",
    description: "",
    visibility: "",
    workspaceId: "",
    isClosed: false,
  });

  const [workspaces, setWorkspaces] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkspaceFromRepository = async () => {
      if (user) {
        populateUserWorkspaceList(user.uid, setWorkspaces);
      }
    };
    fetchWorkspaceFromRepository();
  }, [user]);

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
      board.visibility === "select" ||
      board.workspaceId === "" ||
      board.workspaceId === "select"
    ) {
      alert("All field must be filled");
      return;
    }
    await createBoard(user.uid, user.displayName, board);
    setBoard({
      title: "",
      description: "",
      visibility: "",
      workspaceId: "",
    });
  };

  if (workspaces.length <= 0) {
    return null;
  }

  return (
    <Form>
      <h2>Add Board</h2>
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
      <label htmlFor="visiblity">Visibility</label>
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
      <label htmlFor="workspaceId">Workspace</label>
      <select
        id="workspaceId"
        name="workspaceId"
        onChange={handleFieldChange}
        value={board.workspaceId}
        required
      >
        <option value="select">Select</option>
        {workspaces.map(workspace => (
          <option key={`board-${workspace.id}`} value={workspace.id}>
            {workspace.title}
          </option>
        ))}
      </select>
      <SubmitButton type="submit" value="Create Board" onClick={handleSubmit} />
    </Form>
  );
}
