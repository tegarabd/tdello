import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../../components/Button";
import {
  isEmailInvited,
  isEmailMember,
  populateWorkspaceDetailById,
  updateWorkspace,
} from "../../../../firebase/firestore/workspaceRepository";
import { isEmailRegistered } from "../../../../firebase/firestore/userRepository";
import { useAuth } from "../../../../contexts/AuthProvider";
import { sendEmail } from "../../../../utility/api-server";

const Container = styled.div`
  background-color: aliceblue;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  width: 40rem;
`;
const FullWidthWrapper = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FullWidthInput = styled.input`
  flex: auto;
`;

function InviteMember() {
  const { user } = useAuth();
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState();
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [expiredDate, setExpiredDate] = useState("");

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      await populateWorkspaceDetailById(workspaceId, setWorkspace);
    };
    fetchWorkspaceData();
  }, [workspaceId]);

  useEffect(() => {
    if (workspace && workspace.link) {
      setExpiredDate(workspace.link.expiredDate);
    }
  }, [workspace]);

  const handleOnChange = e => {
    setEmail(e.target.value);
  };

  const handleOnSubmit = async e => {
    e.preventDefault();
    if (emails.includes(email)) {
      alert("This email is already in the list");
      return;
    }
    if (user.email === email) {
      alert("You can not invite yourself");
      return;
    }
    if (!(await isEmailRegistered(email))) {
      alert("This email is not already registered in CHello");
      return;
    }
    if (await isEmailMember(workspaceId, email)) {
      alert("The owner of this email is already a member of this workspace");
      return;
    }
    if (await isEmailInvited(workspaceId, email)) {
      alert("This email is already invited");
      return;
    }
    setEmails([...emails, email]);
    setEmail("");
  };

  const handleSendEmailInvitation = async e => {
    e.preventDefault();
    await sendEmail(
      "Workspace",
      workspace.title,
      user.displayName,
      emails.join(","),
      tokenTolink(workspace.link.token),
      expiredDate
    );
    alert("All email have been notified");
  };

  const handleGenerateNewLink = async e => {
    e.preventDefault();
    if (expiredDate === "") {
      alert("Set expired date first");
      return;
    }
    const token = v4();
    await updateWorkspace(workspaceId, {
      link: {
        token,
        expiredDate,
      },
    });
  };

  const handleCopyButton = e => {
    e.preventDefault();
    navigator.clipboard.writeText(tokenTolink(workspace.link.token));
    alert("Link copied to clipboard");
  };

  const handleChangeExpiredDate = e => {
    e.preventDefault();
    setExpiredDate(e.target.value);
  };

  const handleSubmitChangeExpiredDate = async e => {
    e.preventDefault();
    await updateWorkspace(workspaceId, {
      link: {
        expiredDate: expiredDate,
        token: workspace.link.token,
      },
    });
    alert("expired date successfully updated");
  };

  const tokenTolink = token =>
    `http://localhost:3000/workspaces/${workspaceId}/invite/${token}`;

  const dateToISODatetime = date => {
    const offset = new Date().getTimezoneOffset();
    const datetime = date - offset * 60 * 1000;
    const isoDatetime = new Date(datetime).toISOString().substring(0, 16);
    return isoDatetime;
  };

  return (
    <Container>
      <h3>Invite Member</h3>
      <h4>Invitation Link</h4>
      {!workspace ? (
        <p>Loading...</p>
      ) : workspace.link ? (
        <>
          <FullWidthWrapper>
            <h4 className="linkTitle">Link</h4>
            <FullWidthInput
              type="text"
              defaultValue={tokenTolink(workspace.link.token)}
            />
            <Button onClick={handleCopyButton}>Copy</Button>
          </FullWidthWrapper>
          <FullWidthWrapper>
            <h4 className="linkTitle">Expired Date</h4>
            <FullWidthInput
              type="datetime-local"
              onChange={handleChangeExpiredDate}
              value={expiredDate}
              min={dateToISODatetime(new Date())}
            />
            <Button onClick={handleSubmitChangeExpiredDate}>Change</Button>
          </FullWidthWrapper>
        </>
      ) : (
        <FullWidthWrapper>
          <h4 className="linkTitle">Expired Date</h4>
          <FullWidthInput
            type="datetime-local"
            onChange={handleChangeExpiredDate}
            value={expiredDate}
            min={dateToISODatetime(new Date())}
          />
          <Button onClick={handleGenerateNewLink}>Generate</Button>
        </FullWidthWrapper>
      )}
      <h4>Email Invitation</h4>
      {emails.length > 0 &&
        emails.map(email => (
          <FullWidthWrapper key={email}>
            <FullWidthInput type="email" disabled defaultValue={email} />
          </FullWidthWrapper>
        ))}
      <form onSubmit={handleOnSubmit}>
        <FullWidthWrapper>
          <FullWidthInput
            type="email"
            value={email}
            onChange={handleOnChange}
          />
          <Button>Add</Button>
        </FullWidthWrapper>
      </form>
      {emails.length > 0 && (
        <Button onClick={handleSendEmailInvitation}>Invite</Button>
      )}
    </Container>
  );
}

export default InviteMember;
