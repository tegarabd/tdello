import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";

const Nav = styled.div`
  background-color: aliceblue;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 4rem;
`;
const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export default function Navbar() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout(() => navigate("/signin"));
  };

  return (
    <Nav>
      <Link
        to="/"
        style={{
          color: "#7fa4c5",
          textDecoration: "none",
        }}
      >
        <h1>Chello</h1>
      </Link>
      <NavRight>
        {user ? (
          <>
            <Link to="/profile">
              <h3>{user.displayName}</h3>
            </Link>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        ) : (
          <Button>
            <Link to="/signin">Sign In</Link>
          </Button>
        )}
      </NavRight>
    </Nav>
  );
}
