import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { updateUserProfile } from "../../../firebase/authentication/userAuthentication";
import { updateUser } from "../../../firebase/firestore/userRepository";

const Container = styled.form`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 1rem;
  background-color: aliceblue;
  padding: 2rem;
  border-radius: 1rem;
  grid-row: 1 / span 2;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  grid-column: 1 / span 2;
`;

const TitleWrapper = styled.div`
  grid-column: 1 / span 2;
`;

const Title = styled.h3`
  padding-bottom: 1rem;
  border-bottom: 0.125rem solid #7fa4c5;
  margin: 0;
`;

function ProfileDetailForm({ user }) {
  const [updatedUser, setUpdatedUser] = useState({
    ...user,
    password: "",
    newPassword: "",
  });

  const handleOnChange = e => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    const { displayName, email, password, newPassword } = updatedUser;
    await updateUserProfile(user, email, displayName, newPassword, password);
    await updateUser(user.uid, { displayName, email });
    setUpdatedUser({ ...user, password: "", newPassword: "" });
  };

  return (
    <Container onSubmit={handleOnSubmit}>
      <TitleWrapper>
        <Title>Profile Detail Settings</Title>
      </TitleWrapper>

      <Label htmlFor="displayName">Display Name</Label>
      <input
        type="text"
        id="displayName"
        name="displayName"
        value={updatedUser.displayName}
        onChange={handleOnChange}
      />

      <Label htmlFor="email">Email</Label>
      <input
        type="text"
        id="email"
        name="email"
        value={updatedUser.email}
        onChange={handleOnChange}
      />

      <Label htmlFor="newPassword">New Password</Label>
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        value={updatedUser.newPassword}
        onChange={handleOnChange}
      />

      <Label htmlFor="password">Old Password</Label>
      <input
        type="password"
        id="password"
        name="password"
        value={updatedUser.password}
        onChange={handleOnChange}
      />

      <ButtonWrapper>
        <Button>Update</Button>
      </ButtonWrapper>
    </Container>
  );
}

export default ProfileDetailForm;
