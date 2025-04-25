// src/seeder/seedEvents.js
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const seedEvents = async () => {
  const events = [
    {
      name: 'Amigos Game Night',
      location: 'Detroit, MI',
      grupoId: 'demo-grupo-1',
      date: '2025-05-01',
      creatorId: 'user123',
      attendees: ['user123', 'user456']
    },
    {
      name: 'Coffee & Code Meetup',
      location: 'Ann Arbor, MI',
      grupoId: 'demo-grupo-2',
      date: '2025-05-04',
      creatorId: 'user456',
      attendees: ['user456']
    }
  ];

  for (const event of events) {
    await addDoc(collection(db, 'events'), event);
  }

  console.log('✅ Events seeded');
};

export default seedEvents();
