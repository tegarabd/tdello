import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import List from "../../../components/List";
import { populateUserWatchedCards } from "../../../firebase/firestore/userRepository";
import { Link } from "react-router-dom";

export default function UserWatchedCards() {
  const [cards, setCards] = useState();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchBoardFromRepository = async () => {
      if (user) {
        populateUserWatchedCards(user.uid, setCards)
      }
    };
    fetchBoardFromRepository();
  }, [user]);

  useEffect(() => {
    if (cards !== undefined) setLoading(false);
  }, [cards]);

  if (loading) {
    return <h3>Loading Boards...</h3>;
  }

  return (
    <>
      {cards.length === 0 ? (
        <h3>No Watched Cards yet...</h3>
      ) : (
        <List>
          {cards.map(card => (
            <Link className="link" to={`/boards/${card.boardId}/cards/${card.id}`}>
              <h3 className="linkTitle">{card.title}</h3>
            </Link>
          ))}
        </List>
      )}
    </>
  );
}
