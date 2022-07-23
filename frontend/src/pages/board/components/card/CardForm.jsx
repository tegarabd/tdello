import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthProvider";
import { createCard } from "../../../../firebase/firestore/cardRepository";

export default function CardForm({ listId }) {
  const { boardId } = useParams();
  const { user } = useAuth();
  const [card, setCard] = useState({
    title: "",
    listId,
    boardId,
  });

  const handleFieldChange = e => {
    setCard({
      ...card,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (card.title === "") return;
    createCard(listId, card, user.uid, user.displayName);
    setCard({
      title: "",
      listId,
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
        placeholder="Add new card"
        required
        value={card.title}
      />
      <input type="submit" value="Add" />
    </form>
  );
}
