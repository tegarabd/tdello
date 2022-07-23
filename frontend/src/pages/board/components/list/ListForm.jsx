import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createList } from "../../../../firebase/firestore/listRepository";

export default function ListForm() {
  const { boardId } = useParams();

  const [list, setList] = useState({
    title: "",
    boardId,
  });

  const handleFieldChange = e => {
    setList({
      ...list,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (list.title === "") return;
    createList(boardId, list);
    setList({
      title: "",
      boardId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <input
        id="title"
        type="text"
        name="title"
        onChange={handleFieldChange}
        placeholder="Add new list"
        required
        value={list.title}
      />
      <input type="submit" value="Add" />
    </form>
  );
}
