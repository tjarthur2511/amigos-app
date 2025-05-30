// ✅ Final PublicGrupoPage.jsx – Fully Styled and Punctuation-Corrected
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
  orderBy,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import PostCard from '../../common/PostCard';
import Spinner from '../../common/Spinner';
import GrupoFormModal from './GrupoFormModal';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import FollowButton from '../../common/FollowButton';

const PublicGrupoPage = () => {
  const { grupoId } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [memberUIDs, setMemberUIDs] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingGrupo, setLoadingGrupo] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrupoAndPosts = async () => {
      setLoadingGrupo(true);
      const user = auth.currentUser;
      if (!user) {
        setLoadingGrupo(false);
        return;
      }
      setCurrentUserId(user.uid);

      const grupoRef = doc(db, 'grupos', grupoId);
      const grupoSnap = await getDoc(grupoRef);

      if (grupoSnap.exists()) {
        const grupoData = grupoSnap.data();
        setGrupo(grupoData);
        const currentMemberUIDs = grupoData.members || [];
        setMemberUIDs(currentMemberUIDs);
        setIsMember(currentMemberUIDs.includes(user.uid));

        const followersRef = collection(db, 'grupos', grupoId, 'followers');
        const followersSnap = await getDocs(followersRef);
        setFollowerCount(followersSnap.size);
      } else {
        setGrupo(null);
        setError("Group not found.");
      }

      if (grupoSnap.exists()) {
        const postQuery = query(
          collection(db, 'posts'),
          where('grupoId', '==', grupoId),
          orderBy('createdAt', 'desc')
        );
        const snapPosts = await getDocs(postQuery);
        const results = snapPosts.docs.map(docData => ({ id: docData.id, ...docData.data() }));
        setPosts(results);
      } else {
        setPosts([]);
      }

      setLoadingGrupo(false);
    };

    if (grupoId) fetchGrupoAndPosts();
  }, [grupoId]);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (memberUIDs.length === 0) {
        setMemberDetails([]);
        return;
      }
      setLoadingMembers(true);
      const usersData = [];
      for (const uid of memberUIDs) {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          usersData.push({ uid: userSnap.id, displayName: userSnap.data().displayName || 'Unnamed Amigo' });
        }
      }
      setMemberDetails(usersData);
      setLoadingMembers(false);
    };

    fetchMemberDetails();
  }, [memberUIDs]);

  const toggleMembership = async () => {
    if (!currentUserId || !grupo) return;
    const grupoRef = doc(db, 'grupos', grupoId);
    const newMemberUIDs = isMember
      ? memberUIDs.filter(uid => uid !== currentUserId)
      : [...memberUIDs, currentUserId];

    await updateDoc(grupoRef, { members: newMemberUIDs });

    setMemberUIDs(newMemberUIDs);
    setIsMember(!isMember);
  };

  if (loadingGrupo) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-comfortaa text-coral">
        <Spinner size="lg" color="coral" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 font-comfortaa text-feedback-error">{error}</div>;
  }

  if (!grupo) {
    return <div className="text-center py-10 font-comfortaa text-neutral-600">Group not found. It might have been deleted.</div>;
  }

  const fetchGrupoData = async () => {
    setLoadingGrupo(true);
    const grupoRef = doc(db, 'grupos', grupoId);
    const grupoSnap = await getDoc(grupoRef);
    if (grupoSnap.exists()) {
      setGrupo(grupoSnap.data());
      const followersRef = collection(db, 'grupos', grupoId, 'followers');
      const followersSnap = await getDocs(followersRef);
      setFollowerCount(followersSnap.size);
    } else {
      setError("Group data could not be reloaded.");
      setGrupo(null);
    }
    setLoadingGrupo(false);
  };

  const handleGroupUpdated = () => {
    setIsEditModalOpen(false);
    fetchGrupoData();
  };

  const handleFollowStateChange = (isNowFollowing, countChange) => {
    setFollowerCount(prevCount => prevCount + countChange);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-comfortaa">
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="mb-4 sm:mb-0 flex-grow">
            <h1 className="text-3xl font-bold text-coral">{grupo.name || 'Unnamed Grupo'}</h1>
            <p className="text-sm text-neutral-600 mt-1">{grupo.description || 'No description available.'}</p>
            <p className="text-xs text-neutral-500 mt-1">{followerCount} follower{followerCount === 1 ? '' : 's'}</p>
          </div>
          <div className="flex space-x-2 flex-shrink-0 items-center">
            {currentUserId && grupo && grupo.createdBy === currentUserId && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-button text-sm bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 flex items-center space-x-1.5"
                title="Edit Grupo Details"
              >
                <PencilSquareIcon className="h-5 w-5" />
                <span>Edit</span>
              </button>
            )}
            {currentUserId && grupo && grupo.createdBy !== currentUserId && (
              <FollowButton
                targetId={grupoId}
                targetType="grupo"
                targetName={grupo.name}
                onFollowStateChange={handleFollowStateChange}
              />
            )}
            <button
              onClick={toggleMembership}
              disabled={!currentUserId}
              className={`py-2 px-4 rounded-button font-comfortaa font-bold text-sm shadow-md transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
                isMember
                  ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  : 'bg-coral text-white hover:bg-coral-dark'
              }`}
            >
              {isMember ? 'Leave Group' : 'Join Group'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-coral mb-3">
          Members ({memberUIDs.length})
        </h2>
        {loadingMembers ? (
          <div className="flex justify-center items-center py-4">
            <Spinner size="md" color="coral" />
          </div>
        ) : memberDetails.length > 0 ? (
          <ul className="space-y-2">
            {memberDetails.map(member => (
              <li key={member.uid} className="text-sm text-neutral-700 p-2 rounded-md bg-neutral-50">
                {member.displayName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">No members yet.</p>
        )}
      </div>

      {!isMember && (
        <div className="bg-accent/10 border border-accent/30 text-accent-secondary p-4 mb-6 rounded-lg text-sm">
          Join this grupo to post and interact with others.
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-coral mb-3">Recent Posts</h3>
        {posts.length === 0 && !loadingGrupo ? (
          <p className="text-sm text-neutral-500">No posts yet in this grupo.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {isMember && (
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg">
          <h4 className="text-lg font-semibold text-coral mb-3">New Post (Coming Soon)</h4>
          <p className="text-sm text-neutral-500">Posting UI will be enabled for members only.</p>
        </div>
      )}
      <GrupoFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        grupoToEdit={grupo}
        onGroupSaved={handleGroupUpdated}
      />
    </div>
  );
};

export default PublicGrupoPage;
