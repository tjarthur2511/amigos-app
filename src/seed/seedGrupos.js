import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedGrupos = async () => {
  const grupos = [
    {
      name: 'Detroit Gamers',
      description: 'Casual FPS and co-op game nights.',
      location: 'Detroit, MI',
      isAgeRestricted: false,
      creatorId: 'user123',
      members: ['user123', 'user456']
    },
    {
      name: 'Queer Creatives',
      description: 'A safe space for LGBTQ+ artists and writers.',
      location: 'Ann Arbor, MI',
      isAgeRestricted: true,
      creatorId: 'user456',
      members: ['user456']
    },
    {
      name: 'Trail Blazers',
      description: 'Weekend hiking trips around Michigan.',
      location: 'Grand Rapids, MI',
      isAgeRestricted: false,
      creatorId: 'user789',
      members: ['user789', 'user123']
    }
  ];

  for (const grupo of grupos) {
    await addDoc(collection(db, 'grupos'), grupo);
  }

  console.log('✅ Grupos seeded');
};
