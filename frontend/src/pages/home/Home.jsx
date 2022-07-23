import React from "react";
import styled from "styled-components";
import Template from "../../components/Template";
import CreateBoardForm from "./components/CreateBoardForm";
import CreateWorkspaceForm from "./components/CreateWorkspaceForm";
import Search from "./components/Search";
import UserBoardList from "./components/UserBoardList";
import UserFavoriteBoardList from "./components/UserFavoriteBoardList";
import UserNotificationList from "./components/UserNotificationList";
import UserWatchedCards from "./components/UserWatchedCards";
import UserWorkspaceList from "./components/UserWorkspaceList";

const Container = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

function Home() {
  return (
    <Template
      side={
        <>
          <h2>Favorite Boards</h2>
          <UserFavoriteBoardList/>
          <h2>Workspaces</h2>
          <UserWorkspaceList />
          <h2>Boards</h2>
          <UserBoardList />
          <h2>Watched Cards</h2>
          <UserWatchedCards/>
        </>
      }
      main={
        <>
          <Search />
          <Container>
            <CreateWorkspaceForm />
            <CreateBoardForm />
            <UserNotificationList/>
          </Container>
        </>
      }
    />
  );
}

export default Home;
