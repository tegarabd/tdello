import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import Lists from "./components/list/Lists";
import Template from "../../components/Template";
import {
  populateBoardListByBoardId,
  reorderList,
} from "../../firebase/firestore/listRepository";
import {
  populateBoardDetailById,
  updateBoard,
} from "../../firebase/firestore/boardRepository";
import {
  addCardToList,
  deleteCardFromList,
  reorderCard,
} from "../../firebase/firestore/cardRepository";
import BoardMemberList from "./components/BoardMemberList";
import styled from "styled-components";
import { useBoardMembership } from "../../contexts/BoardMembershipProvider";
import Button from "../../components/Button";
import {
  addBoardToUserFavorite,
  isFavoriteBoard,
  removeBoardFromUserFavorite,
} from "../../firebase/firestore/userRepository";
import { useAuth } from "../../contexts/AuthProvider";
import FilteredCards from "./components/FilteredCards";

const Select = styled.select`
  width: 12rem;
  margin-right: 1rem;
`;

export default function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState();
  const [lists, setLists] = useState([]);
  const [visibility, setVisibility] = useState();
  const { userIsAdmin } = useBoardMembership();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchBoardMetadata = async () => {
      if (boardId) {
        populateBoardDetailById(boardId, setBoard);
        populateBoardListByBoardId(boardId, setLists);
      }
    };

    fetchBoardMetadata();
  }, [boardId]);

  useEffect(() => {
    const identifyIsFavorite = async () => {
      if (user) {
        setIsFavorite(await isFavoriteBoard(user.uid, boardId));
      }
    };
    identifyIsFavorite();
  }, [user, boardId]);

  const handleDragEnd = result => {
    if (result.type === "card") {
      const fromListId = result.source.droppableId;
      const fromIndex = result.source.index;
      const toListId = result.destination.droppableId;
      const toIndex = result.destination.index;

      if (fromListId === toListId && fromIndex === toIndex) return;

      if (fromListId === toListId) {
        const listIndex = lists.findIndex(list => list.id === fromListId);
        const cards = Array.from(lists[listIndex].cards);
        cards.splice(toIndex, 0, cards.splice(fromIndex, 1)[0]);
        lists[listIndex].cards = cards;

        const listsCopy = Array.from(lists);
        listsCopy.splice(listIndex, 1, lists[listIndex]);
        setLists(listsCopy);
        reorderCard(
          fromListId,
          cards.map(card => card.id)
        );
      } else {
        const fromListIndex = lists.findIndex(list => list.id === fromListId);
        const toListIndex = lists.findIndex(list => list.id === toListId);

        const card = lists[fromListIndex].cards[fromIndex];

        const fromListCards = Array.from(lists[fromListIndex].cards);
        const toListCards = Array.from(lists[toListIndex].cards);

        fromListCards.splice(fromIndex, 1);
        toListCards.splice(toIndex, 0, card);

        lists[fromListIndex].cards = fromListCards;
        lists[toListIndex].cards = toListCards;

        const listsCopy = Array.from(lists);
        listsCopy.splice(fromListIndex, 1, lists[fromListIndex]);
        listsCopy.splice(toListIndex, 1, lists[toListIndex]);
        setLists(listsCopy);

        reorderCard(
          fromListId,
          fromListCards.map(card => card.id)
        );
        reorderCard(
          toListId,
          toListCards.map(card => card.id)
        );

        deleteCardFromList(fromListId, card);
        addCardToList(toListId, card);
      }
    } else if (result.type === "list") {
      const fromIndex = result.source.index;
      const toIndex = result.destination.index;

      if (fromIndex === toIndex) return;

      const listsCopy = Array.from(lists);
      listsCopy.splice(toIndex, 0, listsCopy.splice(fromIndex, 1)[0]);
      setLists(listsCopy);
      reorderList(
        boardId,
        listsCopy.map(list => list.id)
      );
    }
  };

  useEffect(() => {
    if (board) setVisibility(board.visibility);
  }, [board]);

  const handleVisibilityChange = e => {
    setVisibility(e.target.value);
  };

  const handleVisibilitySubmit = async e => {
    e.preventDefault();
    await updateBoard(boardId, { visibility });
  };

  const handleToggleFavoriteBoard = async e => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    isFavorite
      ? await removeBoardFromUserFavorite(user.uid, boardId)
      : await addBoardToUserFavorite(user.uid, boardId, board.title);
  };

  return (
    <Template
      side={
        <>
          <Link className="link" to={`/workspaces/${board?.workspaceId}`}>
            <h3 className="linkTitle">Workspace</h3>
          </Link>
          <BoardMemberList boardId={boardId} />
          <h2>Labels <Link to='labels'>⇗</Link> </h2>
          <h2>Filter Cards</h2>
          <FilteredCards/>
        </>
      }
      main={
        <>
          <BoardDetail>
            <h2>
              {board?.title}{" "}
              {isFavorite ? (
                <Button onClick={handleToggleFavoriteBoard}>♥</Button>
              ) : (
                <Button onClick={handleToggleFavoriteBoard}>♡</Button>
              )}
            </h2>
            <h4>{board?.description}</h4>
            <h4>
              {userIsAdmin ? (
                <form onSubmit={handleVisibilitySubmit}>
                  <Select
                    disabled={!userIsAdmin}
                    id="visibility"
                    name="visibility"
                    onChange={handleVisibilityChange}
                    value={visibility}
                  >
                    <option value="private">Private</option>
                    <option value="workspace">Workspace Visible</option>
                    <option value="public">Public</option>
                  </Select>
                  <input type="submit" value="Change" />
                </form>
              ) : (
                visibility
              )}
            </h4>
          </BoardDetail>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Lists lists={lists} />
          </DragDropContext>
        </>
      }
    />
  );
}

const BoardDetail = styled.div`
  height: 10rem;
`;
