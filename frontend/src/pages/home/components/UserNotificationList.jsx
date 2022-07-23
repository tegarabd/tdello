import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AuthProvider";
import { populateUserNotifications } from "../../../firebase/firestore/userRepository";

const Container = styled.div`
  background-color: aliceblue;
  padding: 2rem;
  border-radius: 1rem;
`;

function UserNotificationList() {
  const [notifications, setNotifications] = useState();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        await populateUserNotifications(user.uid, setNotifications);
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <Container>
      <h2>Notifications</h2>
      {!notifications && <h3>Loading Notifications...</h3>}
      {notifications &&
        notifications.map(notification => (
          <p key={notification.id}>
            <b>{notification.message}</b> | {notification.datetime.seconds}
          </p>
        ))}
    </Container>
  );
}

export default UserNotificationList;
