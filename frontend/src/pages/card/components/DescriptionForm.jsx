import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import { updateCard } from "../../../firebase/firestore/cardRepository";

const Wrapper = styled.div`
  background-color: aliceblue;
  padding: 1rem;
`

const Container = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function DescriptionForm({ description }) {
  const { cardId } = useParams();
  const [desc, setDesc] = useState(description);
  const isChanged = useRef(false);

  const handleDelete = e => {
    e.preventDefault();
    setDesc("");
    updateCard(cardId, { description: "" });
  };

  const handleUpdate = e => {
    e.preventDefault();
    updateCard(cardId, { description: desc });
  };

  const handleChange = e => {
    if (!isChanged.current) isChanged.current = true;
    setDesc(e.target.value);
  };

  return (
    <Wrapper>
      <h3>Description</h3>
      <Container>
        <textarea value={desc} onChange={handleChange}></textarea>
        <ButtonWrapper>
          {isChanged.current && <Button onClick={handleUpdate}>Update</Button>}
          <Button reversColor onClick={handleDelete}>
            Delete
          </Button>
        </ButtonWrapper>
      </Container>
    </Wrapper>
  );
}

export default DescriptionForm;
