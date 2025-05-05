import { clearUsers } from "./clearUsers.js";
import { clearGrupos } from "./clearGrupos.js";
import { clearEvents } from "./clearEvents.js";
import { clearReactions } from "./clearReactions.js";
import { clearQuestionSets } from "./clearQuestionSets.js";
import { clearNotifications } from "./clearNotifications.js";

export const clearAll = async () => {
  console.log("🧹 Clearing Amigos database...");
  await clearUsers();
  await clearGrupos();
  await clearEvents();
  await clearReactions();
  await clearQuestionSets();
  await clearNotifications();
  console.log("✅ Cleared ALL seeded data from Firestore");
};
