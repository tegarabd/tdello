import { db } from "../config";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  getDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

export async function addNewUser(userId, username, email) {
  await setDoc(doc(db, "users", userId), {
    displayName: username,
    email
  });
}

export async function populateUserWorkspaceList(userId, callBack) {
  onSnapshot(
    collection(db, `users/${userId}/workspaceMemberOf`),
    querySnapshot => {
      const workspaces = [];
      querySnapshot.forEach(workspace => {
        workspaces.push({ id: workspace.id.trim(), ...workspace.data() });
      });
      callBack(workspaces);
    }
  );
}

export async function populateUserBoardList(userId, callBack) {
  onSnapshot(collection(db, `users/${userId}/boardMemberOf`), querySnapshot => {
    const boards = [];
    querySnapshot.forEach(board => {
      boards.push({ id: board.id.trim(), ...board.data() });
    });
    callBack(boards);
  });
}

export async function joinWorkspace(
  userId,
  userDisplayName,
  workspaceId,
  workspaceTitle
) {
  await setDoc(
    doc(db, doc(`users/${userId}/workspaceMemberOf/${workspaceId}`)),
    { title: workspaceTitle }
  );
  await setDoc(doc(db, doc(`workspaces/${workspaceId}/members/${userId}`)), {
    displayName: userDisplayName,
  });
}

export async function populateUserNotificationSetting(userId, callBack) {
  onSnapshot(doc(db, `users/${userId}`), querySnapshot => {
    const user = querySnapshot.data();
    if (!user.notificationSetting) {
      callBack({
        mention: false,
        invitation: false,
        frequency: "instant",
      });
      return;
    }
    callBack(user.notificationSetting);
  });
}

export async function updateUser(userId, data) {
  await updateDoc(doc(db, `users/${userId}`), data);
}

export async function isEmailRegistered(email) {
  const qry = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(qry);
  if (snapshot.size > 0) return true;
  return false;
}

export async function isFavoriteBoard(userId, boardId) {

  const document = await getDoc(doc(db, `users/${userId}/favoriteBoards/${boardId}`))

  if (!document.exists()) return false
  return true
}

export async function addBoardToUserFavorite(userId, boardId, boardTitle) {
  await setDoc(doc(db, `users/${userId}/favoriteBoards/${boardId}`), {title: boardTitle})
}

export async function removeBoardFromUserFavorite(userId, boardId) {
  await deleteDoc(doc(db, `users/${userId}/favoriteBoards/${boardId}`))
}

export async function populateUserFavoriteBoard(userId, callback) {
  onSnapshot(collection(db, `users/${userId}/favoriteBoards`), querySnapshot => {
    const boards = [];
    querySnapshot.forEach(board => {
      boards.push({ id: board.id.trim(), ...board.data() });
    });
    callback(boards);
  })
}

export async function populateUserWatchedCards(userId, callback) {
  onSnapshot(collection(db, `users/${userId}/watchedCards`), querySnapshot => {
    const cards = []
    querySnapshot.forEach(card => {
      cards.push({id: card.id, ...card.data()})
    })
    callback(cards)
  })
}

export async function populateUserNotifications(userId, callback) {
  const ordered = query(collection(db, `users/${userId}/notifications`), orderBy('datetime', 'desc'))
  onSnapshot(ordered, querySnapshot => {
    callback(querySnapshot.docs.map(notification => ({id: notification.id, ...notification.data()}))) 
  })
}