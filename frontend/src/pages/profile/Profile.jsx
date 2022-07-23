import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Template from "../../components/Template";
import { useAuth } from "../../contexts/AuthProvider";
import NotificationSettingForm from "./components/NotificationSettingForm";
import PhotoURLForm from "./components/PhotoURLForm";
import ProfileDetailForm from "./components/ProfileDetailForm";

const ProfilePicture = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

function Profile() {
  const { user } = useAuth();
  const [userPhotoURL, setUserPhotoURL] = useState();

  useEffect(() => {
    setUserPhotoURL(user?.photoURL);
  }, [user]);

  return (
    <Template
      side={
        <Container>
          <Link className="link" to="/home">
            <h3 className="linkTitle">Home</h3>
          </Link>
          <ProfilePicture
            src={userPhotoURL ? userPhotoURL : "/default-profile-picture.png"}
          />
          <PhotoURLForm user={user} onUpdateFinished={setUserPhotoURL} />
        </Container>
      }
      main={
        <MainContainer>
          <ProfileDetailForm user={user} />
          <NotificationSettingForm user={user} />
        </MainContainer>
      }
    />
  );
}

export default Profile;
