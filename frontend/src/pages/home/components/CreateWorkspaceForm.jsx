import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthProvider";
import { isEmailRegistered } from "../../../firebase/firestore/userRepository";
import { createWorkspace } from "../../../firebase/firestore/workspaceRepository";
import { sendEmail } from "../../../utility/api-server";

const Form = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 1rem;
  gap: 2rem;
  background-color: aliceblue;
`;

const SubmitButton = styled.input`
  align-self: flex-end;
`;

const InputEmail = styled.input`
  flex: auto;
`;

const InviteEmailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export default function CreateWorkspaceForm() {
  const [workspace, setWorkspace] = useState({
    title: "",
    description: "",
    visibility: "",
  });

  const [invitedEmails, setInvitedEmails] = useState([]);
  const [currentInvitedEmail, setCurrentInvitedEmail] = useState("");

  const { user } = useAuth();

  const handleInviteEmail = async e => {
    e.preventDefault();
    if (invitedEmails.includes(currentInvitedEmail)) {
      alert("This email is already in the list");
      return;
    }
    if (!(await isEmailRegistered(currentInvitedEmail))) {
      alert("This email is not already registered in CHello");
      return;
    }
    if (user.email === currentInvitedEmail) {
      alert("You cannot invite yourself");
      return;
    }
    setInvitedEmails([...invitedEmails, currentInvitedEmail]);
    setCurrentInvitedEmail("");
  };

  const handleFieldChange = e => {
    if (e.target.name === "invite") {
      setCurrentInvitedEmail(e.target.value);
      return;
    }
    setWorkspace({
      ...workspace,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      workspace.title === "" ||
      workspace.description === "" ||
      workspace.visibility === "" ||
      workspace.visibility === "select"
    ) {
      alert("All field must be filled");
      return;
    }
    await createWorkspace(user.uid, user.displayName, workspace);
    await Promise.all(
      invitedEmails.map(invitedEmail =>
        sendEmail("Workspace", workspace.title, user.displayName, invitedEmail)
      )
    );
    setWorkspace({
      title: "",
      description: "",
      visibility: "",
    });
  };

  return (
    <Form>
      <h2>Add Workspace</h2>
      <input
        id="title"
        type="text"
        name="title"
        onChange={handleFieldChange}
        placeholder="Title"
        required
        value={workspace.title}
      />
      <input
        id="description"
        type="text"
        name="description"
        onChange={handleFieldChange}
        placeholder="Description"
        required
        value={workspace.description}
      />
      <label htmlFor="visibility">Visibility</label>
      <select
        id="visibility"
        name="visibility"
        onChange={handleFieldChange}
        value={workspace.visibility}
        required
      >
        <option value="select">Select</option>
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
      {invitedEmails.length > 0 && <h3>Invited Email</h3>}
      {invitedEmails.map((email, index) => (
        <InputEmail
          key={`email${index}`}
          id={`email${index}`}
          type="email"
          name="invite"
          value={email}
          disabled={true}
        />
      ))}
      <InviteEmailWrapper>
        <InputEmail
          id="invite"
          type="email"
          name="invite"
          placeholder="Invite Member"
          onChange={handleFieldChange}
          value={currentInvitedEmail}
        />
        <SubmitButton
          type="submit"
          value="Invite"
          onClick={handleInviteEmail}
        />
      </InviteEmailWrapper>
      <SubmitButton
        type="submit"
        value="Create Workspace"
        onClick={handleSubmit}
      />
    </Form>
  );
}
