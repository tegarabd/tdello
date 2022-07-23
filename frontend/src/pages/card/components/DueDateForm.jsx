import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { updateCard } from "../../../firebase/firestore/cardRepository";

const Container = styled.div`
  background-color: aliceblue;
  padding: 1rem;
`

function DueDateForm({ duedate }) {
  const { cardId } = useParams();
  const [date, setDate] = useState(duedate || new Date().toLocaleDateString());

  const handleOnChange = async e => {
    setDate(e.target.value);
    await updateCard(cardId, {duedate: e.target.value})
  };

  return (
    <Container>
      <h3>Due Date</h3>
      <input type="date" value={date} onChange={handleOnChange} />
    </Container>
  );
}

export default DueDateForm;
