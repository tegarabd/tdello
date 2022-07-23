import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/Button";
import Template from "../../components/Template";
import {
  deleteCard,
  populateCardDetailById,
} from "../../firebase/firestore/cardRepository";
import Labels from "./components/Labels";
import Checklist from "./components/Checklist";
import DescriptionForm from "./components/DescriptionForm";
import DueDateForm from "./components/DueDateForm";
import Watchers from "./components/Watchers";
import GeneratedLink from "./components/GeneratedLink";
import Comments from "./components/Comments";
import Attachments from "./components/Attachments";

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;



function Card() {
  const { boardId, cardId } = useParams();
  const [card, setCard] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      if (cardId) {
        populateCardDetailById(cardId, setCard);
      }
    };
    fetchCardData();
  }, [cardId]);

  const handleDeleteCard = async e => {
    e.preventDefault();
    const isSure = window.confirm(`Are you sure to delete ${card.title}?`);
    if (!isSure) return;
    await deleteCard(card);
    navigate(`/boards/${boardId}`);
  };

  if (card === undefined) {
    return <Template side={<h1>Loading...</h1>} />;
  }

  return (
    <Template
      side={
        <Side>
          <Link className="link" to={`/boards/${boardId}`}>
            <h3 className="linkTitle">Board</h3>
          </Link>
          <h1>{card.title}</h1>
          <Labels />
          <Watchers card={card} />
          <Button reversColor onClick={handleDeleteCard}>
            Delete Card
          </Button>
        </Side>
      }
      main={
        <Main>
          <DescriptionForm description={card.description} />
          <GeneratedLink/>
          <Checklist />
          <DueDateForm duedate={card.duedate} />
          <Comments card={card}/>
          <Attachments/>
        </Main>
      }
    />
  );
}

export default Card;
