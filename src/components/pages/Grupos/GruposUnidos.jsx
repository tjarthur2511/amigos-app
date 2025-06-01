// ✅ GruposUnidos.jsx - White Card Layout, zIndex 0, Clean Theme
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';

const GruposUnidos = () => {
  const [joinedGruposDetails, setJoinedGruposDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJoinedGruposDetails = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setJoinedGruposDetails([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const memberOfGruposRef = collection(db, 'users', currentUser.uid, 'memberOfGrupos');
        const memberOfSnapshot = await getDocs(memberOfGruposRef);
        const groupIds = memberOfSnapshot.docs.map(doc => doc.id);

        if (groupIds.length === 0) {
          setJoinedGruposDetails([]);
          setIsLoading(false);
          return;
        }

        const fetchedGroups = [];
        const BATCH_SIZE = 30; // Firestore 'in' query limit

        for (let i = 0; i < groupIds.length; i += BATCH_SIZE) {
          const batchOfIds = groupIds.slice(i, i + BATCH_SIZE);
          if (batchOfIds.length > 0) {
            const gruposQuery = query(collection(db, 'grupos'), where(documentId(), 'in', batchOfIds));
            const gruposSnapshot = await getDocs(gruposQuery);
            gruposSnapshot.docs.forEach(doc => {
              fetchedGroups.push({ id: doc.id, ...doc.data() });
            });
          }
        }

        // Sort alphabetically by group name
        fetchedGroups.sort((a, b) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        });

        setJoinedGruposDetails(fetchedGroups);

      } catch (err) {
        console.error("Error loading joined group details:", err);
        setError("Failed to load your joined grupos. Please try refreshing.");
        setJoinedGruposDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJoinedGruposDetails();
  }, [auth.currentUser?.uid]); // Re-run if user ID changes

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl font-comfortaa z-0">
      <h3 className="text-2xl text-coral font-bold text-center mb-6">
        Your Joined Grupos
      </h3>
      {isLoading && <p className="text-center text-gray-500 py-4">Loading your grupos...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {!isLoading && !error && joinedGruposDetails.length === 0 && (
        <p className="text-center text-coral py-4">
          You haven’t joined any grupos yet.
        </p>
      )}

      {!isLoading && !error && joinedGruposDetails.length > 0 && (
        <ul className="flex flex-col gap-4 mt-4 max-h-[300px] overflow-y-auto pr-2">
          {joinedGruposDetails.map(grupo => (
            <li
              key={grupo.id}
              className="bg-white p-4 rounded-xl shadow-md z-0 cursor-pointer hover:bg-coral-blush transition-colors duration-150 ease-in-out"
              onClick={() => navigate(`/grupos/${grupo.id}`)}
            >
              <p className="text-xl font-bold text-coral">{grupo.name || 'Unnamed Grupo'}</p>
              <p className="text-sm text-gray-700 line-clamp-2">{grupo.description || 'No description available.'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GruposUnidos;
