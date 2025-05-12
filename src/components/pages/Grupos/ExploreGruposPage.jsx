// src/components/pages/Grupos/ExploreGruposPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ExploreGruposPage = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const snapshot = await getDocs(collection(db, 'grupos'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(list);
    };
    fetchGroups();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-[Comfortaa]">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">Explore Grupos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl shadow p-4 border border-[#ffe5e5] hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/grupos/${group.id}`)}
          >
            <h3 className="text-lg font-semibold text-[#FF6B6B]">
              {group.name || 'Unnamed Group'}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {group.description || 'No description provided'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreGruposPage;
