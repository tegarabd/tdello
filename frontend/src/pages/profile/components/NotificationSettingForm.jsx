import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  populateUserNotificationSetting,
  updateUser,
} from "../../../firebase/firestore/userRepository";

const Container = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background-color: aliceblue;
  padding: 2rem;
  border-radius: 1rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: bold;
  align-self: start;
`;

const Input = styled.input`
  align-self: start;
  justify-self: start;
`;

const Select = styled.select`
  align-self: start;
  justify-self: stretch;
`;

const TitleWrapper = styled.div`
  grid-column: 1 / span 2;
`;

const Title = styled.h3`
  padding-bottom: 1rem;
  border-bottom: 0.125rem solid #7fa4c5;
  margin: 0;
`;

function NotificationSettingForm({ user }) {
  const isChanged = useRef(false);

  const [notificationSetting, setNotificationSetting] = useState({
    mention: false,
    invitation: false,
    frequency: "instant",
  });

  useEffect(() => {
    const fetchUserNotificationSetting = async () => {
      if (user) {
        await populateUserNotificationSetting(user.uid, setNotificationSetting);
      }
    };
    fetchUserNotificationSetting();
  }, [user]);

  useEffect(() => {
    if (isChanged.current && user) {
      updateUser(user.uid, { notificationSetting });
    }
  }, [notificationSetting, user]);

  const handleOnChange = e => {
    if (!isChanged.current) isChanged.current = true;

    const target = e.target;
    const name = target.name;

    switch (name) {
      case "mention":
        setNotificationSetting({
          ...notificationSetting,
          [name]: target.checked,
        });
        break;
      case "invitation":
        setNotificationSetting({
          ...notificationSetting,
          [name]: target.checked,
        });
        break;
      case "frequency":
        setNotificationSetting({
          ...notificationSetting,
          [name]: target.value,
        });
        break;
      default:
        break;
    }
  };

  return (
    <Container>
      <TitleWrapper>
        <Title>Notification Settings</Title>
      </TitleWrapper>

      <Label htmlFor="checkbox">From Mentions</Label>
      <Input
        type="checkbox"
        name="mention"
        id="mention"
        onChange={handleOnChange}
        checked={notificationSetting.mention}
      />

      <Label htmlFor="invitation">From Invitation</Label>
      <Input
        type="checkbox"
        name="invitation"
        id="invitation"
        onChange={handleOnChange}
        checked={notificationSetting.invitation}
      />

      <Label htmlFor="frequency">Frequency</Label>
      <Select
        name="frequency"
        id="frequency"
        onChange={handleOnChange}
        value={notificationSetting.frequency}
      >
        <option value="instant">Instantly</option>
        <option value="period">Periodically</option>
        <option value="never">Never</option>
      </Select>
    </Container>
  );
}

export default NotificationSettingForm;
