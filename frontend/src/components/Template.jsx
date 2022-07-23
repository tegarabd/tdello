import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Main from "./Main";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 4rem);
`;

export default function Template({ side, main }) {
  return (
    <>
      <Navbar />
      <Container>
        <Sidebar>{side}</Sidebar>
        <Main>{main}</Main>
      </Container>
    </>
  );
}
