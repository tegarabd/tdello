import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Link, useParams } from "react-router-dom";
import { useBoardMembership } from "../../../../contexts/BoardMembershipProvider";

const StyledCard = styled.div`
  border: 2px solid #7fa4c5;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: aliceblue;
`;

export default function Card({ card, index }) {
  const { boardId } = useParams();
  const { userIsMember } = useBoardMembership();
  return (
    <Draggable
      draggableId={card.id}
      index={index}
      isDragDisabled={!userIsMember}
    >
      {provided => (
        <StyledCard
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Link to={`/boards/${boardId}/cards/${card.id}`}>
            <h4 className="linkTitle">{card.title}</h4>
            <p>{card.description}</p>
          </Link>
        </StyledCard>
      )}
    </Draggable>
  );
}
