import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export async function updateUserProfile(
  user,
  email,
  displayName,
  newPassword,
  password
) {
  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    await updateProfile(user, { displayName });
    await updateEmail(user, email);
    await updatePassword(user, newPassword);
    alert("profile successfully updated");
  } catch (error) {
    alert(error.code);
  }
}

export async function updateUserPhotoURL(user, photoURL) {
  await updateProfile(user, { photoURL });
  alert("photo profile successfully updated");
}
