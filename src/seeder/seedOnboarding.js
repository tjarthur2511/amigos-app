import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

const seedOnboarding = async () => {
  const onboardingQuestions = [
    "What's your favorite way to relax?",
    "Which activities make you lose track of time?",
    "Do you prefer small groups or big gatherings?",
    "What do you enjoy doing outdoors?",
    "What’s a new skill you’d like to learn?",
    "What kind of games do you love?",
    "What’s your go-to creative outlet?",
    "Do you prefer daytime or nighttime adventures?",
    "How do you usually spend weekends?",
    "What topic could you talk about for hours?"
  ];

  const questionSetsRef = collection(db, "questionSets");

  // 🔥 Step 1: Delete all existing onboarding question sets
  const existingOnboarding = await getDocs(
    query(questionSetsRef, where("type", "==", "onboarding"))
  );

  for (const docSnap of existingOnboarding.docs) {
    await deleteDoc(docSnap.ref);
  }

  // ✅ Step 2: Add a new onboarding question set
  await addDoc(questionSetsRef, {
    type: "onboarding",
    questions: onboardingQuestions,
    seeded: true,
  });

  console.log("✅ Onboarding question set cleared and seeded.");
};

export default seedOnboarding;
