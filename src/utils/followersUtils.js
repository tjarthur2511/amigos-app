// src/utils/followersUtils.js
import { db } from '../firebase.js';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  collection
} from 'firebase/firestore';

export const followUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;
  const userRef = doc(db, 'users', currentUserId);
  await updateDoc(userRef, {
    following: arrayUnion(targetUserId),
  });
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId) return;
  const userRef = doc(db, 'users', currentUserId);
  await updateDoc(userRef, {
    following: arrayRemove(targetUserId),
  });
};

export const getFollowers = async (userId) => {
  const usersSnap = await getDocs(collection(db, 'users'));
  return usersSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(user => user.following?.includes(userId));
};
