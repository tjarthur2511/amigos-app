// src/seeder/seedNotifications.js
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const seedNotifications = async () => {
  const notifications = [
    {
      targetUserId: "user123",
      senderId: "Boss1",
      type: "comment",
      category: "comment",
      content: "Boss1 commented on your post!",
      createdAt: serverTimestamp(),
      seeded: true
    },
    {
      targetUserId: "user123",
      senderId: "zen@amigos.ai",
      type: "react",
      category: "emoji",
      content: "ZenBot reacted ❤️ to your post!",
      createdAt: serverTimestamp(),
      seeded: true
    },
    {
      targetUserId: "user123",
      senderId: "luna@amigos.ai",
      type: "follow",
      category: "amigos",
      content: "LunaBot followed you!",
      createdAt: serverTimestamp(),
      seeded: true
    },
    {
      targetUserId: "user123",
      senderId: "Boss1",
      type: "mention",
      category: "grupos",
      content: "Boss1 mentioned you in Gamers United.",
      createdAt: serverTimestamp(),
      seeded: true
    },
    {
      targetUserId: "user123",
      senderId: "Boss1",
      type: "livestream",
      category: "live",
      content: "Boss1 just went live!",
      createdAt: serverTimestamp(),
      seeded: true
    }
  ];

  for (const notif of notifications) {
    await addDoc(collection(db, "notifications"), notif);
  }

  console.log("✅ Seeded Notifications");
};

export default seedNotifications;
