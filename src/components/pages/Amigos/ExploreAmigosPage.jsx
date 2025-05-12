// src/components/pages/Amigos/ExploreAmigosPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ExploreAmigosPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-[Comfortaa]">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">Explore Amigos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow p-4 border border-[#ffe5e5] hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <img
              src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6B6B] mb-3"
            />
            <h3 className="text-lg font-semibold text-[#FF6B6B]">
              {user.displayName || 'Unnamed Amigo'}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {user.bio || 'No bio yet'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreAmigosPage;
