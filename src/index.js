// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Updates the followerCount on a user document.
 * @param {string} userId The ID of the user whose followerCount needs updating.
 * @param {number} change 1 to increment, -1 to decrement.
 * @returns {Promise} A promise that resolves when the update is complete.
 */
const updateUserFollowerCount = async (userId, change) => {
  const userRef = db.collection("users").doc(userId);
  try {
    await userRef.update({
      followerCount: admin.firestore.FieldValue.increment(change),
    });
    functions.logger.log(
        `User followerCount for ${userId} updated by ${change}.`,
    );
  } catch (error) {
    functions.logger.error(
        `Error updating user followerCount for ${userId}:`,
        error,
    );
  }
};

/**
 * Updates the followingUsersCount on a user document.
 * @param {string} userId The ID of the user whose followingUsersCount needs updating.
 * @param {number} change 1 to increment, -1 to decrement.
 * @returns {Promise} A promise that resolves when the update is complete.
 */
const updateUserFollowingUsersCount = async (userId, change) => {
  const userRef = db.collection("users").doc(userId);
  try {
    await userRef.update({
      followingUsersCount: admin.firestore.FieldValue.increment(change),
    });
    functions.logger.log(
        `User followingUsersCount for ${userId} updated by ${change}.`,
    );
  } catch (error) {
    functions.logger.error(
        `Error updating user followingUsersCount for ${userId}:`,
        error,
    );
  }
};

/**
 * Updates the followingGruposCount on a user document.
 * @param {string} userId The ID of the user whose followingGruposCount needs updating.
 * @param {number} change 1 to increment, -1 to decrement.
 * @returns {Promise} A promise that resolves when the update is complete.
 */
const updateUserFollowingGruposCount = async (userId, change) => {
  const userRef = db.collection("users").doc(userId);
  try {
    await userRef.update({
      followingGruposCount: admin.firestore.FieldValue.increment(change),
    });
    functions.logger.log(
        `User followingGruposCount for ${userId} updated by ${change}.`,
    );
  } catch (error) {
    functions.logger.error(
        `Error updating user followingGruposCount for ${userId}:`,
        error,
    );
  }
};

/**
 * Updates the followerCount on a grupo document.
 * @param {string} grupoId The ID of the grupo whose followerCount needs updating.
 * @param {number} change 1 to increment, -1 to decrement.
 * @returns {Promise} A promise that resolves when the update is complete.
 */
const updateGrupoFollowerCount = async (grupoId, change) => {
  const grupoRef = db.collection("grupos").doc(grupoId);
  try {
    await grupoRef.update({
      followerCount: admin.firestore.FieldValue.increment(change),
    });
    functions.logger.log(
        `Grupo followerCount for ${grupoId} updated by ${change}.`,
    );
  } catch (error) {
    functions.logger.error(
        `Error updating grupo followerCount for ${grupoId}:`,
        error,
    );
  }
};

// A. For user.followerCount
exports.onUserFollowerCreate = functions.firestore
    .document("users/{targetUserId}/followers/{followerId}")
    .onCreate(async (snap, context) => {
      const targetUserId = context.params.targetUserId;
      return updateUserFollowerCount(targetUserId, 1);
    });

exports.onUserFollowerDelete = functions.firestore
    .document("users/{targetUserId}/followers/{followerId}")
    .onDelete(async (snap, context) => {
      const targetUserId = context.params.targetUserId;
      return updateUserFollowerCount(targetUserId, -1);
    });

// B. For user.followingUsersCount
exports.onUserFollowingUserCreate = functions.firestore
    .document("users/{initiatingUserId}/followingUsers/{targetUserId}")
    .onCreate(async (snap, context) => {
      const initiatingUserId = context.params.initiatingUserId;
      return updateUserFollowingUsersCount(initiatingUserId, 1);
    });

exports.onUserFollowingUserDelete = functions.firestore
    .document("users/{initiatingUserId}/followingUsers/{targetUserId}")
    .onDelete(async (snap, context) => {
      const initiatingUserId = context.params.initiatingUserId;
      return updateUserFollowingUsersCount(initiatingUserId, -1);
    });

// C. For user.followingGruposCount
exports.onUserFollowingGrupoCreate = functions.firestore
    .document("users/{initiatingUserId}/followingGrupos/{targetGrupoId}")
    .onCreate(async (snap, context) => {
      const initiatingUserId = context.params.initiatingUserId;
      return updateUserFollowingGruposCount(initiatingUserId, 1);
    });

exports.onUserFollowingGrupoDelete = functions.firestore
    .document("users/{initiatingUserId}/followingGrupos/{targetGrupoId}")
    .onDelete(async (snap, context) => {
      const initiatingUserId = context.params.initiatingUserId;
      return updateUserFollowingGruposCount(initiatingUserId, -1);
    });

// D. For grupo.followerCount
exports.onGrupoFollowerCreate = functions.firestore
    .document("grupos/{targetGrupoId}/followers/{followerId}")
    .onCreate(async (snap, context) => {
      const targetGrupoId = context.params.targetGrupoId;
      return updateGrupoFollowerCount(targetGrupoId, 1);
    });

exports.onGrupoFollowerDelete = functions.firestore
    .document("grupos/{targetGrupoId}/followers/{followerId}")
    .onDelete(async (snap, context) => {
      const targetGrupoId = context.params.targetGrupoId;
      return updateGrupoFollowerCount(targetGrupoId, -1);
    });

// Note: For FieldValue.increment to work correctly without issues on new documents,
// ensure that when a user or grupo document is created, these count fields are initialized to 0.
// If they might not be, the helper functions (e.g., updateUserFollowerCount) would need
// to use a transaction to read the document first, get the current count (or 0 if undefined),
// then update. However, FieldValue.increment() itself is designed to initialize if the field
// doesn't exist, provided it's a number operation.
// For robustness if a field might be missing, a transaction is safer:
/*
async function safeUpdateCounter(docRef, fieldName, change) {
  try {
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        // This case should ideally not happen if the main doc (user/grupo) exists
        // when follow docs are created/deleted.
        functions.logger.warn(`Document ${docRef.path} not found for counter update.`);
        return;
      }
      const currentCount = doc.data()[fieldName] || 0;
      const newCount = currentCount + change;
      transaction.update(docRef, { [fieldName]: Math.max(0, newCount) }); // Ensure count doesn't go < 0
    });
    functions.logger.log(`Counter ${fieldName} for ${docRef.path} updated by ${change}.`);
  } catch (error) {
    functions.logger.error(`Error updating counter ${fieldName} for ${docRef.path}:`, error);
  }
}
// Then call safeUpdateCounter instead of the direct userRef.update in helper functions.
// For this implementation, I've used the simpler FieldValue.increment() assuming fields will
// be initialized or that increment handles it well. The Math.max(0, newCount) logic
// within a transaction is the most robust for preventing negative counts.
// FieldValue.increment will not cause a field to go below 0 if it's already 0 and you decrement.
// It will just stay 0 or become negative if that's mathematically what happens.
// The logic to prevent negative counts (if a decrement is triggered more times than an increment)
// is best handled by ensuring the calling logic (follow/unfollow actions) is correct
// or by adding the transaction read-modify-write as shown in this comment.
// For this exercise, FieldValue.increment() is used for brevity as specified in the plan.
*/
