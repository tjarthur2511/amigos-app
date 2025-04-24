import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedEvents = async () => {
  const events = [
    {
      name: 'FPS Night - Call of Duty',
      location: 'Detroit, MI',
      grupoId: 'detroit-gamers', // Use real Firestore ID if available
      date: '2025-04-30',
      creatorId: 'user123',
      attendees: ['user123']
    },
    {
      name: 'Sunset Trail Walk',
      location: 'Grand Rapids, MI',
      grupoId: 'trail-blazers',
      date: '2025-05-03',
      creatorId: 'user789',
      attendees: ['user789', 'user123']
    }
  ];

  for (const event of events) {
    await addDoc(collection(db, 'events'), event);
  }

  console.log('✅ Events seeded');
};
