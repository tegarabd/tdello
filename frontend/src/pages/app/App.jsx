import React from "react";
import { Link } from "react-router-dom";
import Template from "../../components/Template";
import PublicWorkspaceList from "./components/PublicWorkspaceList";

function App() {
  return (
    <Template
      side={
        <>
          <h1>Chello Public Workspaces</h1>
          <Link className="link" to="/home">
            <h3 className="linkTitle">Home</h3>
          </Link>
        </>
      }
      main={<PublicWorkspaceList />}
    />
  );
}

export default App;
