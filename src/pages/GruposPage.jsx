import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  arrayUnion
} from 'firebase/firestore';
import '../styles/GruposPage.css';

const mockUserId = 'user123'; // Replace with real Firebase UID later

function GruposPage() {
  const [grupos, setGrupos] = useState([]);
  const [newGrupo, setNewGrupo] = useState({
    name: '',
    description: '',
    location: '',
    isAgeRestricted: false
  });

  // Fetch all grupos on load
  useEffect(() => {
    const fetchGrupos = async () => {
      const snapshot = await getDocs(collection(db, 'grupos'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGrupos(fetched);
    };
    fetchGrupos();
  }, []);

  // Create new grupo
  const handleCreateGrupo = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'grupos'), {
      ...newGrupo,
      creatorId: mockUserId,
      members: [mockUserId]
    });
    setNewGrupo({ name: '', description: '', location: '', isAgeRestricted: false });

    const updated = await getDocs(collection(db, 'grupos'));
    setGrupos(updated.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Join an existing grupo
  const handleJoin = async (grupoId) => {
    const grupoRef = doc(db, 'grupos', grupoId);
    await updateDoc(grupoRef, {
      members: arrayUnion(mockUserId)
    });

    const updated = await getDocs(collection(db, 'grupos'));
    setGrupos(updated.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div className="grupos-container">
      <h2>Grupos</h2>

      {/* Create Grupo Form */}
      <form className="grupo-form" onSubmit={handleCreateGrupo}>
        <h3>Create a Grupo</h3>
        <input
          type="text"
          placeholder="Group Name"
          value={newGrupo.name}
          onChange={(e) => setNewGrupo({ ...newGrupo, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newGrupo.description}
          onChange={(e) => setNewGrupo({ ...newGrupo, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="City, State"
          value={newGrupo.location}
          onChange={(e) => setNewGrupo({ ...newGrupo, location: e.target.value })}
        />
        <label className="checkbox">
          <input
            type="checkbox"
            checked={newGrupo.isAgeRestricted}
            onChange={(e) =>
              setNewGrupo({ ...newGrupo, isAgeRestricted: e.target.checked })
            }
          />
          Age Restricted (18+)
        </label>
        <button type="submit">Create Grupo</button>
      </form>

      {/* List of All Grupos */}
      <div className="grupos-list">
        {grupos.map((grupo) => (
          <div key={grupo.id} className="grupo-card">
            <h3>{grupo.name}</h3>
            <p>{grupo.description}</p>
            <p><strong>Location:</strong> {grupo.location}</p>
            {grupo.isAgeRestricted && <p className="age-restricted">🔞 18+ Only</p>}
            <button onClick={() => handleJoin(grupo.id)}>Join</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GruposPage;
