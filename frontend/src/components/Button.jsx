import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border: none;
  outline: none;
  padding: 0.5rem 2rem;
  background-color: #7fa4c5;
  color: aliceblue;
  font: inherit;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
`;
const ReverseStyledButton = styled.button`
  border: none;
  outline: none;
  padding: 0.5rem 2rem;
  background-color: transparent;
  border: 0.125rem solid #eb9dae;
  color: #f3a4b5;
  font: inherit;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
`;

function Button({ children, onClick, reversColor, small }) {
  if (reversColor) {
    return (
      <ReverseStyledButton style={{padding: small ? '0 1rem' : '0.5rem 2rem'}} onClick={onClick}>{children}</ReverseStyledButton>
    );
  }
  return <StyledButton style={{padding: small ? '0 1rem' : '0.5rem 2rem'}} onClick={onClick}>{children}</StyledButton>;
}

export default Button;
