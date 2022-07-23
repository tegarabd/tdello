import React from "react";
import { Link } from "react-router-dom";

export default function BoardItem({ board }) {
  return (
    <Link className="link" to={`/boards/${board.id}`}>
      <h3 className="linkTitle">{board.title}</h3>
    </Link>
  );
}
