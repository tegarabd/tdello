import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import {
  addChecklistToCard,
  checkCardChecklist,
  populateCardChecklistById,
  uncheckCardChecklist,
} from "../../../firebase/firestore/cardRepository";

const Container = styled.div`
  background-color: aliceblue;
  padding: 1rem;
  grid-row: 1 / span 2;
`;

const InputWrapper = styled.form`
  display: flex;
  gap: 1rem;
`;

const ChecklistWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Bar = styled.div`
  position: relative;
  width: 100%;
  height: 1rem;
  background-color: white;
  border-radius: 100vmax;
`

const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #7fa4c5;
  height: 1rem;
  border-radius: 100vmax;
`

function Checklist() {
  const { cardId } = useParams();
  const [checklistInput, setChecklistInput] = useState("");
  const [checklists, setChecklists] = useState();

  const handleOnInputChange = e => {
    setChecklistInput(e.target.value);
  };

  const handleOnInputSubmit = async e => {
    e.preventDefault();
    await addChecklistToCard(cardId, checklistInput);
    setChecklistInput("");
  };

  const handleOnChecklistChange = async checklist => {
    if (checklist.checked) {
      await uncheckCardChecklist(cardId, checklist.id);
    } else {
      await checkCardChecklist(cardId, checklist.id);
    }
  };

  useEffect(() => {
    const fetchChecklists = async () => {
      if (cardId) {
        await populateCardChecklistById(cardId, setChecklists);
      }
    };
    fetchChecklists();
  }, [cardId]);

  const checklistPercentage = () => {
    if (checklists) {
      return (
        (checklists.filter(checklist => checklist.checked).length /
          checklists.length) *
        100
      );
    }
  };

  return (
    <Container>
      <h3>Checklist</h3>
      <Bar>
        <Progress style={{width: `${checklistPercentage()}%`}}></Progress>
      </Bar>
      {!checklists && <p>Loading...</p>}
      {checklists &&
        checklists.map(checklist => (
          <ChecklistWrapper key={checklist.id}>
            <p>{checklist.title}</p>
            <input
              type="checkbox"
              checked={checklist.checked}
              onChange={() => handleOnChecklistChange(checklist)}
            />
          </ChecklistWrapper>
        ))}
      <InputWrapper onSubmit={handleOnInputSubmit}>
        <input
          type="text"
          placeholder="Add New Checklist"
          value={checklistInput}
          onChange={handleOnInputChange}
        />
        <Button>Add</Button>
      </InputWrapper>
    </Container>
  );
}

export default Checklist;
