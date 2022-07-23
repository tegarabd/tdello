import React, { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import { updateUserPhotoURL } from "../../../firebase/authentication/userAuthentication";
import { uploadUserPhoto } from "../../../firebase/storage/userStorage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const FileInputContainer = styled.form`
  display: flex;
  justify-content: space-between;
`;

const FileInput = styled.input`
  width: 50%;
  background-color: aliceblue;
  border-radius: 1rem;
  display: flex;
`;

const Title = styled.h3`
  padding-bottom: 1rem;
  border-bottom: 0.125rem solid aliceblue;
  margin: 0;
`;

function PhotoURLForm({ user, onUpdateFinished }) {
  const [photo, setPhoto] = useState(null);

  const handleUpload = async e => {
    e.preventDefault();
    if (!photo) {
      alert("Select image first");
      return;
    }
    const url = await uploadUserPhoto(user.uid, photo);
    await updateUserPhotoURL(user, url);
    onUpdateFinished(url);
  };

  const handleOnChange = e => {
    setPhoto(e.target.files[0]);
  };

  return (
    <Container>
      <Title>Change Profile Photo</Title>
      <FileInputContainer onSubmit={handleUpload}>
        <FileInput type="file" onChange={handleOnChange} />
        <Button>Upload</Button>
      </FileInputContainer>
    </Container>
  );
}

export default PhotoURLForm;
