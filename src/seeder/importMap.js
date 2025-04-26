// src/seeder/importMap.js
import { seedUsers } from './seedUsers.js';
import { seedGrupos } from './seedGrupos.js';
import { seedEvents } from './seedEvents.js';
import { seedQuestionSets } from './seedQuestionSets.js';
import { seedReactions } from './seedReactions.js';
import { clearAll } from './clearAll.js';
import { clearUsers } from './clearUsers.js';
import { clearGrupos } from './clearGrupos.js';
import { clearEvents } from './clearEvents.js';
import { clearReactions } from './clearReactions.js';
import { clearQuestionSets } from './clearQuestionSets.js';
import { clearWeeklyQuestion } from './clearWeeklyQuestion.js';
import { seedAll } from './seedAll.js';

export const SeederScripts = {
  seedUsers,
  seedGrupos,
  seedEvents,
  seedQuestionSets,
  seedReactions,
  seedAll,
  clearAll,
  clearUsers,
  clearGrupos,
  clearEvents,
  clearReactions,
  clearQuestionSets,
  clearWeeklyQuestion,
};
