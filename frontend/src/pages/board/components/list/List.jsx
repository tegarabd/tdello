import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { useBoardMembership } from "../../../../contexts/BoardMembershipProvider";
import { deleteList } from "../../../../firebase/firestore/listRepository";
import Cards from "../card/Cards";

const ListItem = styled.div`
  background-color: aliceblue;
  min-width: 20rem;
  padding: 1rem;
  margin-right: 1rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const List = ({ list, index }) => {
  const { userIsMember } = useBoardMembership();

  const handleOnDeleteList = async (e, list) => {
    e.preventDefault()
    const isSure = window.confirm(`Are you sure to delete ${list.title}?`)
    if (!isSure) return
    await deleteList(list.boardId, list.id)
  }

  return (
    <Draggable
      draggableId={list.id}
      index={index}
      isDragDisabled={!userIsMember}
    >
      {provided => (
        <ListItem
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <TitleWrapper>
            <h3 className="linkTitle">
              {list.title}
            </h3>

            <Button reversColor onClick={e => handleOnDeleteList(e, list)}>Delete</Button>
          </TitleWrapper>

          <Cards listId={list.id} cards={list.cards} />
        </ListItem>
      )}
    </Draggable>
  );
};

export default List;
