// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// 🔁 Generic helper
const updateCount = (ref, field, incrementBy) => {
  return ref.update({
    [field]: admin.firestore.FieldValue.increment(incrementBy),
  });
};

// 👥 User Followers
exports.incrementUserFollowerCount = functions.firestore
  .document("users/{userId}/followers/{followerId}")
  .onCreate((_, context) => {
    const ref = db.doc(`users/${context.params.userId}`);
    return updateCount(ref, "followerCount", 1);
  });

exports.decrementUserFollowerCount = functions.firestore
  .document("users/{userId}/followers/{followerId}")
  .onDelete((_, context) => {
    const ref = db.doc(`users/${context.params.userId}`);
    return updateCount(ref, "followerCount", -1);
  });

// 🧍 User Following (users)
exports.incrementUserFollowingUsersCount = functions.firestore
  .document("users/{userId}/followingUsers/{targetId}")
  .onCreate((_, context) => {
    const ref = db.doc(`users/${context.params.userId}`);
    return updateCount(ref, "followingUsersCount", 1);
  });

exports.decrementUserFollowingUsersCount = functions.firestore
  .document("users/{userId}/followingUsers/{targetId}")
  .onDelete((_, context) => {
    const ref = db.doc(`users/${context.params.userId}`);
    return updateCount(ref, "followingUsersCount", -1);
  });

// 👥 User Following (grupos)
exports.incrementUserFollowingGruposCount = functions.firestore
  .document("users/{userId}/followingGrupos/{grupoId}")
  .onCreate((_, context) => {
    const ref = db.doc(`users/${context.params.userId}`);
    return updateCount(ref, "followingGruposCount", 1);
  });

exports.decrementUserFollowingGruposCount = functions.firestore
  .document("users/{userId}/followingGrupos/{grupoId}")
  .onDelete((_, context) => {
    const ref = db.doc(`users/${context.params.userId}`);
    return updateCount(ref, "followingGruposCount", -1);
  });

// 🧑‍🤝‍🧑 Grupo Followers
exports.incrementGrupoFollowerCount = functions.firestore
  .document("grupos/{grupoId}/followers/{userId}")
  .onCreate((_, context) => {
    const ref = db.doc(`grupos/${context.params.grupoId}`);
    return updateCount(ref, "followerCount", 1);
  });

exports.decrementGrupoFollowerCount = functions.firestore
  .document("grupos/{grupoId}/followers/{userId}")
  .onDelete((_, context) => {
    const ref = db.doc(`grupos/${context.params.grupoId}`);
    return updateCount(ref, "followerCount", -1);
  });
