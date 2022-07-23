import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthProvider";
import { populateBoardMemberListById } from "../../../firebase/firestore/boardRepository";
import {
  addCommentToCard,
  notifyAllCardWatchers,
  populateCardCommentsById,
} from "../../../firebase/firestore/cardRepository";

const Container = styled.div`
  background-color: aliceblue;
  padding: 1rem;
  grid-row: 1 / span 3;
`;

const CommentContainer = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 20rem;
  overflow: auto;
`;

const InputWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
  border-bottom: 0.125rem solid #7fa4c5;
  padding: 1rem 0;
`;

const Form = styled.div`
  margin: 0 0 0.5rem 0;
  font-weight: bold;
`;

const Message = styled.div`
  margin: 0;
`;

function Comments({ card }) {
  const { boardId, cardId } = useParams();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [mention, setMention] = useState("select");
  const [boardMembers, setBoardMembers] = useState();

  const handleOnChange = e => {
    setComment(e.target.value);
  };

  const handleOnMentionChange = e => {
    setMention(e.target.value);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    await addCommentToCard(
      cardId,
      user.displayName,
      comment,
      mention === "select" ? null : mention,
      mention === "select"
        ? null
        : boardMembers.filter(boardMember => boardMember.id === mention)[0].displayName
    );
    await notifyAllCardWatchers(
      cardId,
      `${user.displayName} is commented "${comment}" on ${card.title}`
    );
    setComment("");
    setMention("select");
  };

  useEffect(() => {
    const fetchComment = async () => {
      if (cardId) {
        await populateCardCommentsById(cardId, setComments);
        await populateBoardMemberListById(boardId, setBoardMembers);
      }
    };
    fetchComment();
  }, [cardId, boardId]);

  return (
    <Container>
      <h3>Comment</h3>
      <CommentContainer>
        {!comments && <h4>Loading</h4>}
        {comments &&
          comments.map(comment => (
            <Comment key={comment.id}>
              <Form>{comment.from}{comment.mention && ` | mentioned ${comment.mention}`}</Form>
              <Message>{comment.message}</Message>
            </Comment>
          ))}
      </CommentContainer>
      <InputWrapper onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={comment}
          onChange={handleOnChange}
          placeholder="Comment something"
        />
        <select value={mention} onChange={handleOnMentionChange}>
          <option value="select">Mention Member</option>
          {boardMembers &&
            boardMembers.map(boardMember => (
              <option key={boardMember.id} value={boardMember.id}>
                {boardMember.displayName}
              </option>
            ))}
        </select>
        <Button small>Comment</Button>
      </InputWrapper>
    </Container>
  );
}

export default Comments;
