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
    },
    {
      displayName: "LunaBot",
      email: "luna@amigos.ai",
      quizAnswers: {},
      monthlyQuiz: {}
    },
    {
      displayName: "ZenBot",
      email: "zen@amigos.ai",
      quizAnswers: {},
      monthlyQuiz: {}
    }
  ];

  for (const user of users) {
    await addDoc(collection(db, "users"), user);
  }

  console.log("✅ Seeded Users");
};

export default seedUsers();
