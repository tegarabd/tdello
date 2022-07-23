import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import ListForm from "./ListForm";
import List from "./List";
import { useBoardMembership } from "../../../../contexts/BoardMembershipProvider";

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  align-items: flex-start;
  justify-content: flex-start;
  height: calc(100vh - 16rem - 20px);
`;

function Lists({ lists }) {

  const {userIsMember} = useBoardMembership();

  return (
    <Droppable droppableId="all-list" direction="horizontal" type="list">
      {provided => (
        <ListWrapper ref={provided.innerRef} {...provided.droppableProps}>
          {lists.map((list, index) => (
            <List key={list.id} list={list} index={index} />
          ))}
          {provided.placeholder}
          { userIsMember && <ListForm />}
        </ListWrapper>
      )}
    </Droppable>
  );
}

export default Lists;
