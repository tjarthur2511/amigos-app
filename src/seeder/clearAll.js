import { clearUsers } from "./clearUsers.js";
import { clearGrupos } from "./clearGrupos.js";
import { clearEvents } from "./clearEvents.js";
import { clearReactions } from "./clearReactions.js";
import { clearQuestionSets } from "./clearQuestionSets.js";
import { clearNotifications } from "./clearNotifications.js";

export const clearAll = async () => {
  console.log("🧹 Clearing Amigos database...");

  try {
    console.log("→ Clearing Users");
    await clearUsers();

    console.log("→ Clearing Grupos");
    await clearGrupos();

    console.log("→ Clearing Events");
    await clearEvents();

    console.log("→ Clearing Reactions");
    await clearReactions();

    console.log("→ Clearing Question Sets");
    await clearQuestionSets();

    console.log("→ Clearing Notifications");
    await clearNotifications();

    console.log("✅ Cleared ALL seeded data from Firestore");
    return "✅ Full Firestore clear complete.";
  } catch (err) {
    console.error("❌ clearAll failed:", err.message);
    return `❌ clearAll failed: ${err.message}`;
  }
};
