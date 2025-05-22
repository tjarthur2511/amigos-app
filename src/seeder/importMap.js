import seedUsers from "./seedUsers.js";
import seedGrupos from "./seedGrupos.js";
import seedEvents from "./seedEvents.js";
import seedQuestionSets from "./seedQuestionSets.js";
import seedReactions from "./seedReactions.js";
import seedNotifications from "./seedNotifications.js";
import seedOnboarding from "./seedOnboarding.js"; // ✅ FIXED

import { clearUsers } from "./clearUsers.js";
import { clearGrupos } from "./clearGrupos.js";
import { clearEvents } from "./clearEvents.js";
import { clearReactions } from "./clearReactions.js";
import { clearQuestionSets } from "./clearQuestionSets.js";
import { clearAll } from "./clearAll.js";

import clearSeededData from "./clearSeededData.js";
import clearOnboarding from "./clearOnboarding.js"; // ✅ NEW

// ✅ Named exports
export {
  seedUsers,
  seedGrupos,
  seedEvents,
  seedQuestionSets,
  seedReactions,
  seedNotifications,
  seedOnboarding,         // ✅ FIXED
  clearUsers,
  clearGrupos,
  clearEvents,
  clearReactions,
  clearQuestionSets,
  clearAll,
  clearSeededData,
  clearOnboarding         // ✅ NEW
};

// ✅ Grouped export for Admin use
export const SeederScripts = {
  seedUsers,
  seedGrupos,
  seedEvents,
  seedQuestionSets,
  seedReactions,
  seedNotifications,
  seedOnboarding,         // ✅ FIXED
  clearUsers,
  clearGrupos,
  clearEvents,
  clearReactions,
  clearQuestionSets,
  clearAll,
  clearSeededData,
  clearOnboarding         // ✅ NEW
};
