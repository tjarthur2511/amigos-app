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

const PublicGrupoPage = () => {
  const { grupoId } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [memberUIDs, setMemberUIDs] = useState([]); // Stores UIDs from grupo doc
  const [memberDetails, setMemberDetails] = useState([]); // Stores fetched user objects { uid, displayName }
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loadingGrupo, setLoadingGrupo] = useState(true); // For group data and posts
  const [loadingMembers, setLoadingMembers] = useState(false); // For member details
  const [error, setError] = useState(null); // For potential errors

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
      } else {
        setGrupo(null); // Handle case where grupo doesn't exist
        setError("Group not found."); // Set error if group doesn't exist
      }

      // Only fetch posts if grupo exists
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
        setPosts([]); // Clear posts if group doesn't exist
      }
        collection(db, 'posts'),
        where('grupoId', '==', grupoId),
        orderBy('createdAt', 'desc')
      );
      const snapPosts = await getDocs(postQuery);
      const results = snapPosts.docs.map(docData => ({ id: docData.id, ...docData.data() }));
      setPosts(results);

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
      // Fetch details for each member UID. For larger groups, consider batching with 'in' queries if possible.
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
    
    setMemberUIDs(newMemberUIDs); // Update UIDs first
    setIsMember(!isMember);
    // Member details will be refetched by the second useEffect due to memberUIDs change
  };

  // Combined loading, error, and not found states
  if (loadingGrupo) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] font-comfortaa text-coral">
        <Spinner size="lg" color="coral" />
      </div>
    );
  }

  if (error) { // Display error if group fetch failed or group not found
    return <div className="text-center py-10 font-comfortaa text-feedback-error">{error}</div>;
  }
  
  if (!grupo) { // Should be covered by error state if setError is called when not found
    return <div className="text-center py-10 font-comfortaa text-neutral-600">Group not found. It might have been deleted.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-comfortaa">
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-coral">{grupo.name || 'Unnamed Grupo'}</h1>
            <p className="text-sm text-neutral-600 mt-1">{grupo.description || 'No description available.'}</p>
            {/* Member count displayed below with member list */}
          </div>
          <button
            onClick={toggleMembership}
            disabled={!currentUserId} // Disable if no current user
            className={`py-2 px-4 rounded-button font-comfortaa font-bold text-sm shadow-md transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
              isMember 
                ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' // "Leave" state - less prominent
                : 'bg-coral text-white hover:bg-coral-dark'   // "Join" state - standard primary
            }`}
          >
            {isMember ? 'Leave Group' : 'Join Group'}
          </button>
        </div>
      </div>
      
      {/* Members Section */}
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

      {/* Posts Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold text-coral mb-3">Recent Posts</h3>
        {posts.length === 0 && !loadingGrupo ? ( // Ensure not to show "no posts" during initial load if posts haven't been fetched yet
          <p className="text-sm text-neutral-500">No posts yet in this grupo.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              // PostCard is already styled, no need to wrap it in another styled div unless for specific layout
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {isMember && (
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg">
          <h4 className="text-lg font-semibold text-coral mb-3">New Post (Coming Soon)</h4>
          <p className="text-sm text-neutral-500">Posting UI will be enabled for members only.</p>
          className={`py-2 px-4 rounded-full font-comfortaa font-bold text-sm shadow-md transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed ${
            isMember 
              ? 'bg-coral-dark text-white hover:bg-coral' // "Leave" state - active/undo variation
              : 'bg-coral text-white hover:bg-coral-dark'   // "Join" state - standard primary
          }`}
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
        <h3 className="text-xl font-semibold text-coral mb-2">Recent Posts</h3> {/* Used text-coral */}
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">No posts yet in this grupo.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white p-4 rounded-xl shadow border border-blush" // Used border-blush
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isMember && (
        <div className="mt-10 p-6 bg-white border border-blush rounded-xl shadow"> {/* Used border-blush */}
          <h4 className="text-lg font-semibold text-coral mb-3">New Post (Coming Soon)</h4> {/* Used text-coral */}
          <p className="text-sm text-gray-500">Posting UI will be enabled for members only.</p>
        </div>
      )}
    </div>
  );
};

export default PublicGrupoPage;
