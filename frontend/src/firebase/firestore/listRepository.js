import { db } from "../config";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { deleteCard } from "./cardRepository";

export async function populateBoardListByBoardId(boardId, callBack) {
  onSnapshot(doc(db, `boards/${boardId}`), async querySnapshot => {
    const data = querySnapshot.data();
    if (!data.listOrder || data.listOrder.length <= 0) return;
    const promises = querySnapshot
      .data()
      .listOrder.map(listId => getDoc(doc(db, `lists/${listId}`)));
    const lists = await Promise.all(promises);
    const listsWithCards = lists.map(async list => {
      if (!list.data().cardOrder || list.data().cardOrder.length <= 0)
        return { id: list.id, ...list.data(), cards: [] };
      const cardPromises = list
        .data()
        .cardOrder.map(cardId => getDoc(doc(db, `cards/${cardId}`)));
      const cards = await Promise.all(cardPromises);
      return {
        id: list.id,
        ...list.data(),
        cards: cards.map(card => ({ id: card.id, ...card.data() })),
      };
    });
    callBack(await Promise.all(listsWithCards));
  });
}

export async function createList(boardId, list) {
  const listRef = await addDoc(collection(db, "lists"), list);
  await setDoc(doc(db, `boards/${boardId}/lists/${listRef.id}`), {
    title: list.title,
  });

  const snapshot = await getDoc(doc(db, `boards/${boardId}`));
  if (!snapshot.exists()) {
    console.log("board not found");
    return;
  }
  const data = snapshot.data();

  if (!data.listOrder || data.listOrder.length <= 0) {
    data.listOrder = [];
  }

  data.listOrder.push(listRef.id);

  await setDoc(doc(db, `boards/${boardId}`), data, { merge: true });
}

export async function reorderList(boardId, listOrder) {
  await updateDoc(doc(db, `boards/${boardId}`), {
    listOrder,
  });
}

export async function deleteList(boardId, listId) {
  const cards = (await getDoc(doc(db, `lists/${listId}`))).data().cardOrder;
  await Promise.all(cards.map(cardId => deleteCard({ id: cardId, listId })));
  await deleteDoc(doc(db, `lists/${listId}`));
  await deleteDoc(doc(db, `boards/${boardId}/lists/${listId}`));
  const listOrder = (await getDoc(doc(db, `boards/${boardId}`))).data()
    .listOrder;
  const indexToDelete = listOrder.findIndex(list => list === listId);
  listOrder.splice(indexToDelete, 1);
  await updateDoc(doc(db, `boards/${boardId}`), { listOrder });
}
