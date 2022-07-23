import { storage } from "../config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadUserPhoto(userId, photo) {
  const photoRef = ref(storage, `userPhoto/${userId}`);
  await uploadBytes(photoRef, photo);
  const url = await getDownloadURL(photoRef);
  return url;
}
