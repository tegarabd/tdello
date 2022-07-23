import { db } from "../config";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export async function createBoard(userId, userDisplayName, board) {
  const boardRef = await addDoc(collection(db, "boards"), { ...board });
  await setDoc(
    doc(db, `workspaces/${board.workspaceId}/boards`, boardRef.id.trim()),
    { title: board.title, isClosed: board.isClosed }
  );
  await setDoc(doc(db, `users/${userId}/boardMemberOf`, boardRef.id.trim()), {
    title: board.title,
  });
  await setDoc(doc(db, `boards/${boardRef.id.trim()}/members`, userId), {
    displayName: userDisplayName,
    isAdmin: true,
  });
}

export async function populateBoardDetailById(boardId, callBack) {
  onSnapshot(doc(db, `boards/${boardId}`), querySnapshot => {
    callBack({ id: querySnapshot.id.trim(), ...querySnapshot.data() });
  });
}

export async function populateBoardMemberListById(boardId, callBack) {
  onSnapshot(collection(db, `boards/${boardId}/members`), querySnapshot => {
    const members = [];
    querySnapshot.forEach(member => {
      members.push({ id: member.id.trim(), ...member.data() });
    });
    callBack(members);
  });
}

export async function convertUserToBoardMemberData(boardId, userId) {
  const document = await getDoc(doc(db, `boards/${boardId}/members/${userId}`));
  if (!document.exists()) return null;
  const member = document.data();
  return member;
}

export async function getBoardByInvitationLink(boardId, token) {
  const document = await getDoc(doc(db, `boards/${boardId}`));
  const board = document.data();

  if (!board || !board.link || board.link.token !== token) {
    return null;
  }

  return board;
}

export async function addMember(boardId, userId, boardData, userData) {
  await setDoc(doc(db, `boards/${boardId}/members/${userId}`), userData);
  await setDoc(doc(db, `users/${userId}/boardMemberOf/${boardId}`), boardData);
}

export async function removeMember(boardId, userId) {
  await deleteDoc(doc(db, `boards/${boardId}/members/${userId}`));
  await deleteDoc(doc(db, `users/${userId}/boardMemberOf/${boardId}`));
}

export async function grantAdmin(boardId, userId) {
  await updateDoc(doc(db, `boards/${boardId}/members/${userId}`), {
    isAdmin: true,
  });
}

export async function revokeAdmin(boardId, userId) {
  await updateDoc(doc(db, `boards/${boardId}/members/${userId}`), {
    isAdmin: false,
  });
}

export async function updateBoard(boardId, data) {
  await updateDoc(doc(db, `boards/${boardId}`), data);
}

export async function isEmailInvited(boardId, email) {
  const document = await getDoc(doc(db, `boards/${boardId}`));
  const data = document.data();

  if (
    !data.invitedEmails ||
    data.invitedEmails.length <= 0 ||
    !data.invitedEmails.filter(invitedEmail => invitedEmail === email)[0]
  ) {
    return false;
  }

  return true;
}

export async function isEmailMember(boardId, email) {
  const documents = await getDocs(collection(db, `boards/${boardId}/members`));
  const members = await Promise.all(
    documents.docs.map(document => getDoc(doc(db, `users/${document.id}`)))
  );

  if (members.filter(member => member.data().email === email).length > 0) {
    return true;
  }

  return false;
}

export async function populateBoardLabelById(boardId, callback) {
  onSnapshot(collection(db, `boards/${boardId}/labels`), querySnapshot => {
    const labels = [];
    querySnapshot.forEach(label => {
      labels.push({ id: label.id, ...label.data() });
    });
    callback(labels);
  });
}

export async function addLabelToBoard(boardId, label) {
  await addDoc(collection(db, `boards/${boardId}/labels`), label)
}

export async function notifyAllMembers(boardId, message) {
  const boardMembers = await getDocs(collection(db, `boards/${boardId}/members`))
  await Promise.all(boardMembers.docs.map(member => addDoc(collection(db, `users/${member.id}/notifications`), {message, datetime: new Date()})))
}