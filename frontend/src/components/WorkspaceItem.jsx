import React from "react";
import { Link } from "react-router-dom";

export default function WorkspaceItem({ workspace }) {
  return (
    <Link to={`/workspaces/${workspace.id}`} className="link">
      <h3 className="linkTitle">{workspace.title}</h3>
    </Link>
  );
}
