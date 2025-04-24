import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import '../styles/AmigosPage.css';

const mockUserId = 'user123'; // Replace with auth UID

function AmigosPage() {
  const [users, setUsers] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [filters, setFilters] = useState({
    gender: '',
    language: '',
    location: '',
    lgbtq: false,
    poc: false,
    search: ''
  });

  // Load all users
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const allUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== mockUserId);
      setUsers(allUsers);
    };

    const fetchAmigos = async () => {
      const userRef = doc(db, 'users', mockUserId);
      const snapshot = await getDocs(collection(db, 'users'));
      const amigosList = snapshot.docs
        .map(doc => doc.data())
        .find(user => user.id === mockUserId)?.amigos || [];
      setAmigos(amigosList);
    };

    const fetchBlocked = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const user = snapshot.docs.find(doc => doc.id === mockUserId);
      setBlocked(user?.data()?.blocked || []);
    };

    fetchUsers();
    fetchAmigos();
    fetchBlocked();
  }, []);

  // Apply inclusive filters
  const filteredUsers = users.filter(user => {
    if (blocked.includes(user.id)) return false;
    if (filters.gender && user.gender !== filters.gender) return false;
    if (filters.language && user.language !== filters.language) return false;
    if (filters.location && !user.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.lgbtq && !user.tags?.includes('lgbtq')) return false;
    if (filters.poc && !user.tags?.includes('poc')) return false;
    if (filters.search && !user.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const handleFollow = async (targetId) => {
    const userRef = doc(db, 'users', mockUserId);
    await updateDoc(userRef, {
      amigos: arrayUnion(targetId)
    });
    setAmigos([...amigos, targetId]);
  };

  const handleUnfollow = async (targetId) => {
    const userRef = doc(db, 'users', mockUserId);
    await updateDoc(userRef, {
      amigos: arrayRemove(targetId)
    });
    setAmigos(amigos.filter(id => id !== targetId));
  };

  const handleBlock = async (targetId) => {
    const userRef = doc(db, 'users', mockUserId);
    await updateDoc(userRef, {
      blocked: arrayUnion(targetId)
    });
    setBlocked([...blocked, targetId]);
  };

  return (
    <div className="amigos-container">
      <h2>Find New Amigos</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Nonbinary</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
          <option value="">Language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>
        <input
          type="text"
          placeholder="Location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={filters.lgbtq}
            onChange={(e) => setFilters({ ...filters, lgbtq: e.target.checked })}
          />
          LGBTQ+ Inclusive
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.poc}
            onChange={(e) => setFilters({ ...filters, poc: e.target.checked })}
          />
          POC-Friendly
        </label>
      </div>

      <div className="amigos-list">
        {filteredUsers.map(user => (
          <div key={user.id} className="amigo-card">
            <h3>{user.name}</h3>
            <p>{user.bio}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Language:</strong> {user.language}</p>
            {amigos.includes(user.id) ? (
              <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
            ) : (
              <button onClick={() => handleFollow(user.id)}>Follow</button>
            )}
            <button onClick={() => handleBlock(user.id)} className="block-btn">Block</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmigosPage;
