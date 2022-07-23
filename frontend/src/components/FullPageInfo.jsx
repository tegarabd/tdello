import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #7fa4c5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 30rem;
  height: 30rem;
  border-radius: 2rem;
  background-color: aliceblue;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

function FullPageInfo({children}) {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  )
}

export default FullPageInfo