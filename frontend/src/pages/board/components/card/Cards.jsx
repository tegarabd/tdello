import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import CardForm from "./CardForm";
import Card from "./Card";
import { useBoardMembership } from "../../../../contexts/BoardMembershipProvider";

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Cards({ listId, cards }) {
  const { userIsMember } = useBoardMembership();

  return (
    <Droppable droppableId={listId} type="card">
      {provided => (
        <CardWrapper ref={provided.innerRef} {...provided.droppableProps}>
          {cards.map((card, index) => (
            <Card key={card.id} index={index} card={card} />
          ))}
          {provided.placeholder}
          {userIsMember && <CardForm listId={listId} />}
        </CardWrapper>
      )}
    </Droppable>
  );
}
