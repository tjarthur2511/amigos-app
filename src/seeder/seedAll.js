// src/seeder/seedAll.js
import seedUsers from "./seedUsers.js";
import seedGrupos from "./seedGrupos.js";
import seedEvents from "./seedEvents.js";
import seedQuestionSets from "./seedQuestionSets.js";
import seedReactions from "./seedReactions.js";
import seedNotifications from "./seedNotifications.js"; // ✅ NEW

const seedAll = async () => {
  console.log("🌱 Seeding All Amigos Collections...");
  await seedUsers();
  await seedGrupos();
  await seedEvents();
  await seedQuestionSets();
  await seedReactions();
  await seedNotifications(); // ✅ NEW
  console.log("✅ Amigos DB Seeding Complete");
};

export default seedAll;
