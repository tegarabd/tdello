import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";

const Container = styled.div`
  background-color: aliceblue;
  padding: 1rem;
`;

const LinkWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

function GeneratedLink() {
  const { boardId, cardId } = useParams();

  return (
    <Container>
      <h3>Link</h3>
      <LinkWrapper>
        <input
          type="text"
          defaultValue={`http://localhost:3000/boards/${boardId}/cards/${cardId}`}
        />
        <Button
          onClick={() => {
            navigator.clipboard.write(
              `http://localhost:3000/boards/${boardId}/cards/${cardId}`
            );
            alert("Link copied!");
          }}
        >
          Copy
        </Button>
      </LinkWrapper>
    </Container>
  );
}

export default GeneratedLink;
