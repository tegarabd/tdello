import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import { populateBoardLabelById } from "../../../firebase/firestore/boardRepository";
import {
  attachLabelToCard,
  detachLabelFromCard,
  populateCardLabelById,
} from "../../../firebase/firestore/cardRepository";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  gap: 1rem;
`;

const Select = styled.select`
  background-color: aliceblue;
  padding: 0.5rem 1rem;
  border-radius: 100vmax;
  flex: auto;
`;

const Form = styled.form`
  display: flex;
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

function Labels() {
  const { boardId, cardId } = useParams();
  const [cardLabels, setCardLabels] = useState();
  const [boardLabels, setBoardLabels] = useState();
  const [labelId, setLabelId] = useState("select");

  const handleOnChange = e => {
    setLabelId(e.target.value);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    if (labelId === "select") return;
    const label = boardLabels.filter(label => label.id === labelId)[0];
    await attachLabelToCard(cardId, label);
  };

  const handleDetachLabel = async (e, label) => {
    e.preventDefault();
    const isSure = window.confirm(`Are you sure to detach ${label.title}?`);
    if (!isSure) return;
    await detachLabelFromCard(cardId, label.id);
  };

  useEffect(() => {
    const fetchCardLabels = async () => {
      if (cardId) {
        populateCardLabelById(cardId, setCardLabels);
        populateBoardLabelById(boardId, setBoardLabels);
      }
    };
    fetchCardLabels();
  }, [cardId, boardId]);

  return (
    <Container>
      <h3>Labels</h3>
      {!cardLabels && <h3>Loading...</h3>}
      {cardLabels &&
        cardLabels.map(label => (
          <LabelWrapper key={label.id}>
            <Label label={label} />
            <Button
              reversColor
              small
              onClick={e => handleDetachLabel(e, label)}
            >
              Detach
            </Button>
          </LabelWrapper>
        ))}
      <Form onSubmit={handleOnSubmit}>
        <Select value={labelId} onChange={handleOnChange}>
          <option value="select">Select</option>
          {boardLabels &&
            boardLabels.map(label => (
              <option value={label.id} key={label.id}>
                {label.title}
              </option>
            ))}
        </Select>
        <Button small>Attach</Button>
      </Form>
    </Container>
  );
}

export default Labels;
