import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthProvider";

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: aliceblue;
  display: grid;
  place-items: center;
`;

const Form = styled.form`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;
  padding: 2rem;
  border-radius: 1rem;
`;

export default function Signin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSignIn = () => {
    auth
      .signin(user.email, user.password, () =>
        navigate(from, { replace: true })
      )
      .catch(error => alert(error.code));
  };

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const { email, password } = user;

    if (email.length <= 0 || password.length <= 0) {
      alert("All field must be filled");
      return;
    }

    handleSignIn();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <input
          id="email"
          type="email"
          name="email"
          onChange={handleOnChange}
          placeholder="Email"
          value={user.email}
        />
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleOnChange}
          placeholder="Password"
          value={user.password}
        />
        <input type="submit" value="Submit" />
        <p>
          Don't have an account?{" "}
          <Link to="/signup">
            <b>Sign Up</b>
          </Link>
        </p>
      </Form>
    </Container>
  );
}
