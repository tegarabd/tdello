import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AuthProvider, { useAuth } from "./contexts/AuthProvider";
import App from "./pages/app/App";
import Home from "./pages/home/Home";
import Workspace from "./pages/workspace/Workspace";
import Signin from "./pages/signin/Signin";
import Signup from "./pages/signup/Signup";
import Board from "./pages/board/Board";
import Card from "./pages/card/Card";
import Profile from "./pages/profile/Profile";
import WorkspaceInvitation from "./pages/workspace/components/invitation/WorkspaceInvitation";
import WorkspaceMembers from "./pages/workspace/components/members/WorkspaceMembers";
import WorkspaceMembershipProvider from "./contexts/WorkspaceMembershipProvider";
import WorkspaceMiddleware from "./middleware/WorkspaceMiddleware";
import BoardInvitation from "./pages/board/components/invitation/BoardInvitation";
import BoardMembers from "./pages/board/components/members/BoardMembers";
import BoardMembershipProvider from "./contexts/BoardMembershipProvider";
import BoardMiddleware from "./middleware/BoardMiddleware";
import CreateLabelForm from "./pages/board/components/label/CreateLabelForm";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="signin"
          element={
            <RequireSignout>
              <Signin />
            </RequireSignout>
          }
        />
        <Route
          path="signup"
          element={
            <RequireSignout>
              <Signup />
            </RequireSignout>
          }
        />
        <Route
          path="home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="workspaces/:workspaceId"
          element={
            <WorkspaceMembershipProvider>
              <WorkspaceMiddleware>
                <Workspace />
              </WorkspaceMiddleware>
            </WorkspaceMembershipProvider>
          }
        />
        <Route
          path="workspaces/:workspaceId/invite/:token"
          element={
            <WorkspaceMembershipProvider>
              <WorkspaceInvitation />
            </WorkspaceMembershipProvider>
          }
        />
        <Route
          path="workspaces/:workspaceId/members"
          element={
            <WorkspaceMembershipProvider>
              <WorkspaceMiddleware>
                <WorkspaceMembers />
              </WorkspaceMiddleware>
            </WorkspaceMembershipProvider>
          }
        />
        <Route
          path="boards/:boardId"
          element={
            <BoardMembershipProvider>
              <BoardMiddleware>
                <Board />
              </BoardMiddleware>
            </BoardMembershipProvider>
          }
        />
        <Route
          path="boards/:boardId/invite/:token"
          element={
            <BoardMembershipProvider>
              <BoardInvitation />
            </BoardMembershipProvider>
          }
        />
        <Route
          path="boards/:boardId/members"
          element={
            <BoardMembershipProvider>
              <BoardMiddleware>
                <BoardMembers />
              </BoardMiddleware>
            </BoardMembershipProvider>
          }
        />
        <Route
          path="boards/:boardId/labels"
          element={
            <BoardMembershipProvider>
              <BoardMiddleware>
                <CreateLabelForm/>
              </BoardMiddleware>
            </BoardMembershipProvider>
          }
        />
        <Route path="boards/:boardId/cards/:cardId" element={<Card />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <h1>404 Not Found</h1>
              <h3>There's nothing here!</h3>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

function RequireSignout({ children }) {
  const { user } = useAuth();

  if (user != null) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
