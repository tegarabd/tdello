import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BoardItem from "../../../components/BoardItem";
import WorkspaceItem from "../../../components/WorkspaceItem";
import { useAuth } from "../../../contexts/AuthProvider";
import {
  populateUserBoardList,
  populateUserWorkspaceList,
} from "../../../firebase/firestore/userRepository";

const ResultContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

function Search() {
  const { user } = useAuth();
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState("");

  const handleOnChange = e => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchAllResult = async () => {
      if (user) {
        await populateUserWorkspaceList(user.uid, workspaces => {
          setResult(prev => prev.filter(res => res.type !== "workspace"));
          setResult(prev => [
            ...prev,
            ...workspaces.map(workspace => ({
              ...workspace,
              type: "workspace",
            })),
          ]);
        });
        await populateUserBoardList(user.uid, boards => {
          setResult(prev => prev.filter(res => res.type !== "board"));
          setResult(prev => [
            ...prev,
            ...boards.map(board => ({ ...board, type: "board" })),
          ]);
        });
      }
    };

    fetchAllResult();
  }, [user]);

  return (
    <div>
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Search"
        value={search}
        onChange={handleOnChange}
      />
      <ResultContainer>
        {result
          .filter(
            item =>
              item.title.toLowerCase().indexOf(search.toLocaleLowerCase()) !==
                -1 && search.length > 0
          )
          .map(item => {
            let itemElement;

            switch (item.type) {
              case "workspace":
                itemElement = <WorkspaceItem key={`search-${item.id}`} workspace={item} />;
                break;
              case "board":
                itemElement = <BoardItem key={`search-${item.id}`} board={item} />;
                break;
              default:
                break;
            }

            return itemElement;
          })}
      </ResultContainer>
    </div>
  );
}

export default Search;
