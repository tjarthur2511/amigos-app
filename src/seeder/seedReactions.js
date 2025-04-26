// src/seeder/seedReactions.js
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

const seedReactions = async () => {
  const reactions = [
    { type: "like", icon: "👍" },
    { type: "dislike", icon: "👎" },
    { type: "love", icon: "❤️" },
    { type: "laugh", icon: "😂" },
    { type: "wow", icon: "😮" },
    { type: "sad", icon: "😢" },
    { type: "angry", icon: "😡" }
  ];

  for (const reaction of reactions) {
    await addDoc(collection(db, "reactions"), reaction);
  }

  console.log("✅ Seeded Reactions");
};

export default seedReactions();
