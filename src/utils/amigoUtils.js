import {
    db,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    getDocs,
    query,
    where,
  } from "../firebase";
  
  /**
   * Fetch all amigos (friends) of a given user.
   * @param {string} userId
   * @returns {Promise<Array<Object>>}
   */
  export const getUserAmigos = async (userId) => {
    const amigosRef = collection(db, "amigos");
    const snapshot = await getDocs(amigosRef);
    const amigoIds = [];
  
    snapshot.forEach((doc) => {
      const { users } = doc.data();
      if (users.includes(userId)) {
        const otherId = users.find((id) => id !== userId);
        if (otherId) amigoIds.push(otherId);
      }
    });
  
    // Now get full user data
    const userDocs = await Promise.all(
      amigoIds.map(async (id) => {
        const userSnap = await getDoc(doc(db, "users", id));
        return userSnap.exists() ? { id, ...userSnap.data() } : null;
      })
    );
  
    return userDocs.filter(Boolean);
  };
  
  /**
   * Get suggested amigos not already friends with the user.
   * Optionally include filters later.
   * @param {string} userId
   * @returns {Promise<Array<Object>>}
   */
  export const getSuggestedAmigos = async (userId) => {
    const allUsersSnap = await getDocs(collection(db, "users"));
    const allUsers = [];
    allUsersSnap.forEach((doc) => {
      if (doc.id !== userId) {
        allUsers.push({ id: doc.id, ...doc.data() });
      }
    });
  
    const currentAmigos = await getUserAmigos(userId);
    const currentAmigoIds = currentAmigos.map((amigo) => amigo.id);
  
    return allUsers.filter((user) => !currentAmigoIds.includes(user.id));
  };
  
  /**
   * Add a mutual amigo connection.
   * @param {string} userId
   * @param {string} otherUserId
   */
  export const addAmigo = async (userId, otherUserId) => {
    const docId = [userId, otherUserId].sort().join("_");
    await setDoc(doc(db, "amigos", docId), {
      users: [userId, otherUserId],
      createdAt: new Date().toISOString(),
    });
  };
  
  /**
   * Remove an amigo connection.
   * @param {string} userId
   * @param {string} otherUserId
   */
  export const removeAmigo = async (userId, otherUserId) => {
    const docId = [userId, otherUserId].sort().join("_");
    await deleteDoc(doc(db, "amigos", docId));
  };
  