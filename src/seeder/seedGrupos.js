// src/seeder/seedGrupos.js
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

const seedGrupos = async () => {
  const grupos = [
    {
      name: "Gamers United",
      description: "Competitive and casual gaming!",
      location: "Monroe, MI",
      creatorId: "Boss1",
      members: ["Boss1"],
      isPublic: true
    },
    {
      name: "Creative Collective",
      description: "Writers, artists, musicians unite.",
      location: "Detroit, MI",
      creatorId: "user123",
      members: ["user123"],
      isPublic: true
    }
  ];

  for (const grupo of grupos) {
    await addDoc(collection(db, "grupos"), grupo);
  }

  console.log("✅ Seeded Grupos");
};

export default seedGrupos();
