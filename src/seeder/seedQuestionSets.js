// src/seeder/seedQuestionSets.js
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

const seedQuestionSets = async () => {
  const questions = [
    {
      text: "Do you enjoy hiking?",
      type: "yesno",
      seeded: true
    },
    {
      text: "What genres of games do you play?",
      type: "multiple",
      options: ["FPS", "RPG", "MOBA", "Puzzle", "Sim"],
      seeded: true
    },
    {
      text: "What hobbies do you enjoy?",
      type: "multiple",
      options: ["Gaming", "Cooking", "Sports", "Art", "Music", "Coding"],
      seeded: true
    }
  ];

  for (const question of questions) {
    await addDoc(collection(db, "questionSets"), question);
  }

  console.log("✅ Seeded Question Sets");
};

export default seedQuestionSets;
