// src/seeder/importMap.js
import seedUsers from "./seedUsers.js";
import seedGrupos from "./seedGrupos.js";
import seedEvents from "./seedEvents.js";
import seedQuestionSets from "./seedQuestionSets.js";
import seedReactions from "./seedReactions.js";

import { clearUsers } from "./clearUsers.js";
import { clearGrupos } from "./clearGrupos.js";
import { clearEvents } from "./clearEvents.js";
import { clearReactions } from "./clearReactions.js";
import { clearQuestionSets } from "./clearQuestionSets.js";
import { clearWeeklyQuestion } from "./clearWeeklyQuestion.js";
import { clearAll } from "./clearAll.js";

import clearSeededData from "./clearSeededData.js"; // ✅ ADD THIS

export {
  seedUsers,
  seedGrupos,
  seedEvents,
  seedQuestionSets,
  seedReactions,
  clearUsers,
  clearGrupos,
  clearEvents,
  clearReactions,
  clearQuestionSets,
  clearWeeklyQuestion,
  clearAll,
  clearSeededData, // ✅ EXPORT IT
};
