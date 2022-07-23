import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  width: 12rem;
  height: 6rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 1rem;
  background-color: #7fa4c5;
  color: aliceblue;
  border-radius: 1rem;
`;

const Title = styled.h3`
  text-align: end;
  margin: 0;
`;

export default function BoardCard({ board }) {
  return (
    <Link to={`/boards/${board.id}`}>
      <Card>
        <Title>{board.title}</Title>
      </Card>
    </Link>
  );
}
