// src/seeder/clearAll.js
import clearUsers from './clearUsers.js';
import clearGrupos from './clearGrupos.js';
import clearEvents from './clearEvents.js';
import clearReactions from './clearReactions.js';
import clearQuestionSets from './clearQuestionSets.js';
import clearWeeklyQuestion from './clearWeeklyQuestion.js';

const clearAll = async () => {
  console.log("🧹 Clearing all seeded data...");
  await Promise.all([
    clearUsers(),
    clearGrupos(),
    clearEvents(),
    clearReactions(),
    clearQuestionSets(),
    clearWeeklyQuestion(),
  ]);
  console.log("✅ All collections cleared");
};

export default clearAll;
