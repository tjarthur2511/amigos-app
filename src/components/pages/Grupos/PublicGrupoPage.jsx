// src/components/pages/Grupos/PublicGrupoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import PostCard from '../../common/PostCard';

const PublicGrupoPage = () => {
  const { grupoId } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupo = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setCurrentUserId(user.uid);

      const ref = doc(db, 'grupos', grupoId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setGrupo(data);
        setMembers(data.members || []);
        setIsMember((data.members || []).includes(user.uid));
      }

      const postQuery = query(
        collection(db, 'posts'),
        where('grupoId', '==', grupoId),
        orderBy('createdAt', 'desc')
      );
      const snapPosts = await getDocs(postQuery);
      const results = snapPosts.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(results);

      setLoading(false);
    };

    if (grupoId) fetchGrupo();
  }, [grupoId]);

  const toggleMembership = async () => {
    if (!currentUserId) return;
    const ref = doc(db, 'grupos', grupoId);
    const updated = isMember
      ? members.filter(id => id !== currentUserId)
      : [...members, currentUserId];
    await updateDoc(ref, { members: updated });
    setMembers(updated);
    setIsMember(!isMember);
  };

  if (loading || !grupo) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-[Comfortaa]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#FF6B6B]">{grupo.name || 'Unnamed Grupo'}</h1>
          <p className="text-sm text-gray-600">{grupo.description || 'No description available.'}</p>
          <p className="text-sm text-gray-500 mt-1">{members.length} member{members.length === 1 ? '' : 's'}</p>
        </div>
        <button
          onClick={toggleMembership}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-150 ${isMember ? 'bg-gray-300 text-black' : 'bg-[#FF6B6B] text-white hover:bg-[#e15555]'}`}
        >
          {isMember ? 'Leave' : 'Join'} Grupo
        </button>
      </div>

      {!isMember && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 text-sm rounded-lg p-4 mb-6">
          Join this grupo to post and interact with others.
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-[#FF6B6B] mb-2">Recent Posts</h3>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">No posts yet in this grupo.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-xl shadow border border-[#ffe0e0]"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isMember && (
        <div className="mt-10 p-6 bg-white border border-[#ffe0e0] rounded-xl shadow">
          <h4 className="text-lg font-semibold text-[#FF6B6B] mb-3">New Post (Coming Soon)</h4>
          <p className="text-sm text-gray-500">Posting UI will be enabled for members only.</p>
        </div>
      )}
    </div>
  );
};

export default PublicGrupoPage;
