import { db } from "../config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function createWorkspace(userId, userDisplayName, workspace) {
  const workspaceRef = await addDoc(collection(db, "workspaces"), {
    ...workspace,
  });
  await setDoc(
    doc(db, `users/${userId}/workspaceMemberOf`, workspaceRef.id.trim()),
    { title: workspace.title }
  );
  await setDoc(
    doc(db, `workspaces/${workspaceRef.id.trim()}/members`, userId),
    {
      displayName: userDisplayName,
      isAdmin: true,
    }
  );
}

export async function populateWorkspaceDetailById(workspaceId, callBack) {
  onSnapshot(doc(db, `workspaces/${workspaceId}`), querySnapshot => {
    callBack({ id: querySnapshot.id.trim(), ...querySnapshot.data() });
  });
}

export async function populateWorkspaceBoardListById(workspaceId, callBack) {
  onSnapshot(
    collection(db, `workspaces/${workspaceId}/boards`),
    querySnapshot => {
      const boards = [];
      querySnapshot.forEach(board => {
        boards.push({ id: board.id.trim(), ...board.data() });
      });
      callBack(boards);
    }
  );
}

export async function populateWorkspaceMemberListById(workspaceId, callBack) {
  onSnapshot(
    collection(db, `workspaces/${workspaceId}/members`),
    querySnapshot => {
      const members = [];
      querySnapshot.forEach(member => {
        members.push({ id: member.id.trim(), ...member.data() });
      });
      callBack(members);
    }
  );
}

export async function populatePublicWorkspaceList(callback) {
  onSnapshot(
    query(collection(db, "workspaces"), where("visibility", "==", "public")),
    querySnapshot => {
      const publicWorkspaces = [];
      querySnapshot.forEach(workspace => {
        publicWorkspaces.push({ id: workspace.id, ...workspace.data() });
      });
      callback(publicWorkspaces);
    }
  );
}

export async function getWorkspaceByInvitationLink(workspaceId, token) {
  const document = await getDoc(doc(db, `workspaces/${workspaceId}`));
  const workspace = document.data();

  if (!workspace || !workspace.link || workspace.link.token !== token) {
    return null;
  }

  return workspace;
}

export async function isEmailInvited(workspaceId, email) {
  const document = await getDoc(doc(db, `workspaces/${workspaceId}`));
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

export async function isEmailMember(workspaceId, email) {
  const documents = await getDocs(
    collection(db, `workspaces/${workspaceId}/members`)
  );
  const members = await Promise.all(
    documents.docs.map(document => getDoc(doc(db, `users/${document.id}`)))
  );

  if (members.filter(member => member.data().email === email).length > 0) {
    return true;
  }

  return false;
}

export async function updateWorkspace(workspaceId, data) {
  await updateDoc(doc(db, `workspaces/${workspaceId}`), data);
}

export async function removeMember(workspaceId, userId) {
  await deleteDoc(doc(db, `workspaces/${workspaceId}/members/${userId}`));
  await deleteDoc(doc(db, `users/${userId}/workspaceMemberOf/${workspaceId}`));
}

export async function addMember(workspaceId, userId, workspaceData, userData) {
  await setDoc(
    doc(db, `workspaces/${workspaceId}/members/${userId}`),
    userData
  );
  await setDoc(
    doc(db, `users/${userId}/workspaceMemberOf/${workspaceId}`),
    workspaceData
  );
}

export async function notifyAllMembers(workspaceId, message) {
  const workspaceMembers = await getDocs(collection(db, `workspaces/${workspaceId}/members`))
  await Promise.all(workspaceMembers.docs.map(member => addDoc(collection(db, `users/${member.id}/notifications`), {message, datetime: new Date()})))
}

export async function convertUserToWorkspaceMemberData(workspaceId, userId) {
  const document = await getDoc(
    doc(db, `workspaces/${workspaceId}/members/${userId}`)
  );
  if (!document.exists()) return null;
  const member = document.data();
  return member;
}

export async function revokeAdmin(workspaceId, userId) {
  await updateDoc(doc(db, `workspaces/${workspaceId}/members/${userId}`), {
    isAdmin: false,
  });
}

export async function grantAdmin(workspaceId, userId) {
  await updateDoc(doc(db, `workspaces/${workspaceId}/members/${userId}`), {
    isAdmin: true,
  });
}
