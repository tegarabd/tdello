import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import FullPageInfo from "../../../../components/FullPageInfo";
import Label from "../../../../components/Label";
import { addLabelToBoard, populateBoardLabelById } from "../../../../firebase/firestore/boardRepository";

const LabelWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 16rem;
  gap: 1rem;
`;

const Input = styled.input`
  flex: auto;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex: auto;
  width: 100%;
`;

function CreateLabelForm() {
  const { boardId } = useParams();
  const [labels, setLabels] = useState();
  const [label, setLabel] = useState({});

  useEffect(() => {
    const fetchLabels = async () => {
      if (boardId) {
        populateBoardLabelById(boardId, setLabels);
      }
    };
    fetchLabels();
  }, [boardId]);

  const handleOnChange = e => {
    setLabel({
      ...label,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    await addLabelToBoard(boardId, label)
    setLabel({})
  };

  return (
    <FullPageInfo>
      <LabelWrapper>
        {!labels && <h3>Loading...</h3>}
        {labels && labels.map(label => <Label key={label.id} label={label} />)}
      </LabelWrapper>
      <h3>Create New Label</h3>
      <Form onSubmit={handleOnSubmit}>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleOnChange}
        />
        <InputWrapper>
          <label htmlFor="color">Color</label>
          <input
            id="color"
            type="color"
            name="color"
            onChange={handleOnChange}
          />
        </InputWrapper>
        <Input type="submit" value="Add" />
      </Form>
    </FullPageInfo>
  );
}

export default CreateLabelForm;
