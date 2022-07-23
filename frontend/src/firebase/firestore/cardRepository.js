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
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function populateCardByListId(listId, callBack) {
  onSnapshot(doc(db, `lists/${listId}`), async querySnapshot => {
    const data = querySnapshot.data();
    if (!data.cardOrder || data.cardOrder.length <= 0) return;
    const promises = data.cardOrder.map(cardId =>
      getDoc(doc(db, `cards/${cardId}`))
    );
    const cards = await Promise.all(promises);
    callBack(cards.map(card => ({ id: card.id, ...card.data() })));
  });
}

export async function createCard(listId, card, userId, userDisplayName) {
  const cardRef = await addDoc(collection(db, "cards"), card);
  setDoc(doc(db, `lists/${listId}/cards`, cardRef.id.trim()), {
    title: card.title,
  });

  const snapshot = await getDoc(doc(db, `lists/${listId}`));
  if (!snapshot.exists()) {
    console.log("board not found");
    return;
  }
  const data = snapshot.data();

  if (!data.cardOrder || data.cardOrder.length <= 0) {
    data.cardOrder = [];
  }

  data.cardOrder.push(cardRef.id.trim());

  await setDoc(doc(db, `lists/${listId}`), data, { merge: true });

  assignUserToCard(
    cardRef.id,
    card.title,
    card.boardId,
    userId,
    userDisplayName
  );
}

export async function assignUserToCard(
  cardId,
  cardTitle,
  cardBoardId,
  userId,
  userDisplayName
) {
  await setDoc(doc(db, `cards/${cardId}/watchers/${userId}`), {
    displayName: userDisplayName,
  });

  await setDoc(doc(db, `users/${userId}/watchedCards/${cardId}`), {
    title: cardTitle,
    boardId: cardBoardId,
  });
}

export async function unassignUserToCard(cardId, userId) {
  await deleteDoc(doc(db, `cards/${cardId}/watchers/${userId}`));
  await deleteDoc(doc(db, `users/${userId}/watchedCards/${cardId}`));
}

export async function addCardToList(listId, card) {
  await setDoc(doc(db, `lists/${listId}/cards/${card.id}`), {
    title: card.title,
  });
}

export async function deleteCardFromList(listId, card) {
  await deleteDoc(doc(db, `lists/${listId}/cards/${card.id}`));
}

export async function reorderCard(listId, cardOrder) {
  await updateDoc(doc(db, `lists/${listId}`), {
    cardOrder,
  });
}

export async function populateCardDetailById(cardId, callback) {
  onSnapshot(doc(db, `cards/${cardId}`), card => {
    callback({ id: card.id, ...card.data() });
  });
}

export async function updateCard(cardId, data) {
  await updateDoc(doc(db, `cards/${cardId}`), data);
}

export async function deleteCard(card) {
  // delete from all card watcher
  const watchers = await getDocs(collection(db, `cards/${card.id}/watchers`));
  await Promise.all(
    watchers.docs.map(watcher =>
      deleteDoc(doc(db, `users/${watcher.id}/watchedCards/${card.id}`))
    )
  );

  // delete from cardOrder
  const list = await getDoc(doc(db, `lists/${card.listId}`));
  const cardOrder = list.data().cardOrder;
  const indexToDelete = cardOrder.findIndex(cardId => cardId === card.id);
  cardOrder.splice(indexToDelete, 1);
  await updateDoc(doc(db, `lists/${list.id}`), { cardOrder });

  // delete from list
  await deleteDoc(doc(db, `lists/${list.id}/cards/${card.id}`));

  // delete all subcollection
  // watchers
  await Promise.all(
    watchers.docs.map(watcher =>
      deleteDoc(doc(db, `cards/${card.id}/watchers/${watcher.id}`))
    )
  );
  // labels
  const labels = await getDocs(collection(db, `cards/${card.id}/labels`));
  await Promise.all(
    labels.docs.map(label =>
      deleteDoc(doc(db, `cards/${card.id}/labels/${label.id}`))
    )
  );

  // delete card
  await deleteDoc(doc(db, `cards/${card}`));
}

export async function populateCardLabelById(cardId, callback) {
  onSnapshot(collection(db, `cards/${cardId}/labels`), querySnapshot => {
    const labels = [];
    querySnapshot.forEach(label => {
      labels.push({ id: label.id, ...label.data() });
    });
    callback(labels);
  });
}

export async function attachLabelToCard(cardId, label) {
  await setDoc(doc(db, `cards/${cardId}/labels/${label.id}`), {
    title: label.title,
    color: label.color,
  });
}

export async function detachLabelFromCard(cardId, labelId) {
  await deleteDoc(doc(db, `cards/${cardId}/labels/${labelId}`));
}

export async function populateCardByBoardId(boardId, callback) {
  const qry = query(collection(db, `cards`), where("boardId", "==", boardId));
  onSnapshot(qry, async querySnapshot => {
    const cards = await Promise.all(
      querySnapshot.docs.map(async card => {
        const labels = await getDocs(collection(db, `cards/${card.id}/labels`));
        return {
          id: card.id,
          ...card.data(),
          labels: labels.docs.map(label => label.id),
        };
      })
    );
    callback(cards);
  });
}

export async function populateCardWatchersById(cardId, callback) {
  onSnapshot(collection(db, `cards/${cardId}/watchers`), querySnapshot => {
    callback(
      querySnapshot.docs.map(watcher => ({ id: watcher.id, ...watcher.data() }))
    );
  });
}

export async function populateCardChecklistById(cardId, callback) {
  onSnapshot(collection(db, `cards/${cardId}/checklist`), querySnapshot => {
    callback(
      querySnapshot.docs.map(checklist => ({ id: checklist.id, ...checklist.data() }))
    );
  });
}

export async function addChecklistToCard(cardId, title) {
  await addDoc(collection(db, `cards/${cardId}/checklist`), {
    title,
    checked: false
  })
}

export async function checkCardChecklist(cardId, checklistId) {
  await updateDoc(doc(db, `cards/${cardId}/checklist/${checklistId}`), {checked: true})
}

export async function uncheckCardChecklist(cardId, checklistId) {
  await updateDoc(doc(db, `cards/${cardId}/checklist/${checklistId}`), {checked: false})
}

export async function removeChecklistFromCard(cardId, checklistId) {
  await deleteDoc(doc(db, `cards/${cardId}/checklist/${checklistId}`))
}

export async function populateCardCommentsById(cardId, callback) {
  onSnapshot(collection(db, `cards/${cardId}/comments`), querySnapshot => {
    callback(
      querySnapshot.docs.map(comment => ({ id: comment.id, ...comment.data() }))
    );
  });
}

export async function addCommentToCard(cardId, from, message, mentionUserId, mentionDisplayName) {
  await addDoc(collection(db, `cards/${cardId}/comments`), {
    from,
    message,
    mention: mentionDisplayName
  })
  if (mentionUserId) {
    await addDoc(collection(db, `users/${mentionUserId}/notifications`), {message: `${from} mentioned you in comment "${message}".`, datetime: new Date()})
  }
}

export async function removeCommentFromCard(cardId, commentId) {
  await deleteDoc(doc(db, `cards/${cardId}/comments/${commentId}`))
}

export async function notifyAllCardWatchers(cardId, message) {
  const cardWatchers = await getDocs(collection(db, `cards/${cardId}/watchers`))
  await Promise.all(cardWatchers.docs.map(member => addDoc(collection(db, `users/${member.id}/notifications`), {message, datetime: new Date()})))
}