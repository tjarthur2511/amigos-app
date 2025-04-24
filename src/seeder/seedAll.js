// src/seeder/seedAll.js
import seedUsers from './seedUsers.js';
import seedGrupos from './seedGrupos.js';
import seedEvents from './seedEvents.js';
import seedQuestionSets from './seedQuestionSets.js';
import seedReactions from './seedReactions.js';

const seedAll = async () => {
  console.log('🌱 Seeding all collections...');
  await seedUsers();
  await seedGrupos();
  await seedEvents();
  await seedQuestionSets();
  await seedReactions();
  console.log('✅ All collections seeded');
};

export default seedAll();