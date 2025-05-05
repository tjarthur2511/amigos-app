// src/seeder/seedUsers.js
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

const seedUsers = async () => {
  const users = [
    {
      displayName: "TJ Arthur",
      email: "tjarthur2511@gmail.com",
      quizAnswers: {},
      monthlyQuiz: {},
      isAdmin: true,
      uid: "Boss1"
      // No seeded flag – this is your real user
    },
    {
      displayName: "LunaBot",
      email: "luna@amigos.ai",
      quizAnswers: {},
      monthlyQuiz: {},
      seeded: true
    },
    {
      displayName: "ZenBot",
      email: "zen@amigos.ai",
      quizAnswers: {},
      monthlyQuiz: {},
      seeded: true
    }
  ];

  for (const user of users) {
    await addDoc(collection(db, "users"), user);
  }

  console.log("✅ Seeded demo users added.");
};

export default seedUsers;
