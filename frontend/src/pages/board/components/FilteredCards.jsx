import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Label from "../../../components/Label";
import { populateBoardLabelById } from "../../../firebase/firestore/boardRepository";
import { populateCardByBoardId } from "../../../firebase/firestore/cardRepository";

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function FilteredCards() {
  const { boardId } = useParams();
  const [boardLabels, setBoardLabels] = useState();
  const [cards, setCards] = useState();
  const [selectedLabelIds, setSelectedLabelIds] = useState([]);

  useEffect(() => {
    const fetchCardLabels = async () => {
      if (boardId) {
        populateBoardLabelById(boardId, setBoardLabels);
        populateCardByBoardId(boardId, setCards);
      }
    };
    fetchCardLabels();
  }, [boardId]);

  const handleSelectedLabels = labelId => {
    selectedLabelIds.includes(labelId)
      ? setSelectedLabelIds([
          ...selectedLabelIds.filter(
            selectedLabelId => selectedLabelId !== labelId
          ),
        ])
      : setSelectedLabelIds([...selectedLabelIds, labelId]);
  };

  return (
    <Container>
      {!boardLabels && <p>Loading Labels</p>}
      {boardLabels &&
        boardLabels.map(label => (
          <LabelWrapper key={label.id}>
            <Label label={label} />
            <input
              type="checkbox"
              onChange={() => handleSelectedLabels(label.id)}
            />
          </LabelWrapper>
        ))}
      {!cards && <p>Loading Cards</p>}
      {cards &&
        cards
          .filter(
            card =>
              card.labels.findIndex(labelId =>
                selectedLabelIds.includes(labelId)
              ) !== -1
          )
          .map(card => (
            <Link
              key={card.id}
              className="link"
              to={`/boards/${boardId}/cards/${card.id}`}
            >
              <h3 className="linkTitle">{card.title}</h3>
            </Link>
          ))}
    </Container>
  );
}

export default FilteredCards;
