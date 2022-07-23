import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthProvider";
import { isAlphaNumberic, isValidEmail } from "../../utility/validation";

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

export default function Signup() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignUp = () => {
    auth.register(user.name, user.email, user.password, () =>
      navigate("/home")
    );
  };

  const [user, setUser] = useState({
    name: "",
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

    const { name, email, password } = user;
    const fieldErrors = [];

    if (name.length <= 0 || email.length <= 0 || password.length <= 0) {
      fieldErrors.push("All field must be filled");
    }
    if (name.length < 5 || name.length > 20) {
      fieldErrors.push("Name must be between 5 - 20 characters");
    }
    if (!isValidEmail(email)) {
      fieldErrors.push("Email must be valid");
    }
    if (password.length < 8 || password.length > 20) {
      fieldErrors.push("Password must be between 8 - 20 characters");
    }
    if (!isAlphaNumberic(password)) {
      fieldErrors.push("Password must be contains [ A-Z | a-z ] and [ 0 - 9 ]");
    }

    if (fieldErrors.length > 0) {
      alert(fieldErrors.join("\n"));
      return;
    }

    handleSignUp();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input
          id="name"
          type="text"
          name="name"
          onChange={handleOnChange}
          placeholder="Name"
          value={user.name}
        />
        <input
          id="email"
          type="text"
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
          Already have an account?{" "}
          <Link to="/signin">
            <b>Sign In</b>
          </Link>
        </p>
      </Form>
    </Container>
  );
}
