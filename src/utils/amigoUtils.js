// src/utils/amigoUtils.js
import { db } from '../firebase';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';

/**
 * Get amigos the user is already following.
 * @param {string} uid
 * @returns {Promise<Array<Object>>}
 */
export async function getUserAmigos(uid) {
  const q = query(collection(db, 'users'), where('amigos', 'array-contains', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get suggested amigos (everyone else).
 * @param {string} uid
 * @returns {Promise<Array<Object>>}
 */
export async function getSuggestedAmigos(uid) {
  const q = query(collection(db, 'users'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(user => user.id !== uid);
}

/**
 * Get amigos that share the same grupo(s) with the user.
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
export async function getAmigosByGrupos(userId) {
  const gruposRef = collection(db, "grupos");
  const snapshot = await getDocs(gruposRef);

  const userGrupoIds = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.members && data.members.includes(userId)) {
      userGrupoIds.push(doc.id);
    }
  });

  const amigosSet = new Set();

  for (const grupoId of userGrupoIds) {
    const grupoDoc = await getDoc(doc(db, "grupos", grupoId));
    if (grupoDoc.exists()) {
      const { members } = grupoDoc.data();
      members.forEach((id) => {
        if (id !== userId) amigosSet.add(id);
      });
    }
  }

  const amigos = await Promise.all(
    [...amigosSet].map(async (id) => {
      const userSnap = await getDoc(doc(db, "users", id));
      return userSnap.exists() ? { id, ...userSnap.data() } : null;
    })
  );

  return amigos.filter(Boolean);
}
