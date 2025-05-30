// src/components/pages/ProfilePage/PublicProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth, db } from '../../../firebase.js';
import NavBar from '../../NavBar';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import FollowButton from '../../common/FollowButton'; // Import FollowButton
import Spinner from '../../common/Spinner'; // Import Spinner for loading state

const PublicProfilePage = () => {
  const { userId } = useParams(); // This is the ID of the profile being viewed
  const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(null); // ID of the logged-in user
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingUserCount, setFollowingUserCount] = useState(0);
  // Not fetching followingGrupoCount for public profile display to keep it simpler for now
  const [posts, setPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false); // This will be managed by FollowButton now
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const loggedInUser = auth.currentUser;
      if (!userId) { // userId is from useParams, profile being viewed
        setLoading(false);
        return;
      }
      
      if (loggedInUser) {
        setCurrentLoggedInUserId(loggedInUser.uid);
      }

      // Fetch public profile user's data
      const publicUserRef = doc(db, 'users', userId);
      const publicUserSnap = await getDoc(publicUserRef);

      if (publicUserSnap.exists()) {
        setUserData(publicUserSnap.data());

        // Fetch follower count for the public profile
        const followersRef = collection(db, 'users', userId, 'followers');
        const followersSnap = await getDocs(followersRef);
        setFollowerCount(followersSnap.size);

        // Fetch following count for the public profile (users they are following)
        const followingUsersRef = collection(db, 'users', userId, 'followingUsers');
        const followingUsersSnap = await getDocs(followingUsersRef);
        setFollowingUserCount(followingUsersSnap.size);

      } else {
        setUserData(null); // User not found
      }

      // Fetch posts (remains the same)
      const postQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const postSnap = await getDocs(postQuery);
      setPosts(postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const answerQuery = query(
        collection(db, 'quizAnswers'),
        where('userId', '==', userId),
        orderBy('answeredAt', 'desc'),
        limit(10)
      );
      const answerSnap = await getDocs(answerQuery);
      setAnswers(answerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const grupoQuery = query(
        collection(db, 'grupos'),
        where('members', 'array-contains', userId),
        orderBy('lastActivity', 'desc'),
        limit(5)
      );
      const grupoSnap = await getDocs(grupoQuery);
      setGrupos(grupoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setLoading(false);
    };
    init();
  }, [userId]);

  const toggleFollow = async () => {
    if (!currentUserId || !userId) return;
    const currentUserRef = doc(db, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
    });
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="coral" />
      </div>
    );
  }
  if (!userData) return <div className="text-center py-10 font-comfortaa text-neutral-600">User profile not found.</div>;

  const backgroundClass = userData.background === 'beach' ? 'bg-gradient-to-br from-yellow-100 to-blue-200' :
                          userData.background === 'city' ? 'bg-gradient-to-br from-gray-200 to-gray-400' :
                          userData.background === 'forest' ? 'bg-gradient-to-br from-green-100 to-green-400' :
                          userData.background === 'galaxy' ? 'bg-gradient-to-br from-purple-900 to-indigo-700 text-white' :
                          userData.background === 'blush' ? 'bg-blush' : // Added blush option from theme
                          'bg-coral'; // Default to coral if no specific background or if 'Default Coral' was selected

  return (
    <div className={`min-h-screen font-comfortaa ${backgroundClass}`}> {/* Used font-comfortaa */}
      <NavBar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={userData.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-coral" // Used border-coral
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-coral">{userData.displayName || 'Unnamed Amigo'}</h2>
            <p className="text-sm text-neutral-700">{userData.bio || 'No bio provided.'}</p> {/* Use neutral-700 for better contrast on light BGs */}
            <div className="mt-2 flex space-x-4 text-sm text-neutral-600">
              {/* TODO: Make these clickable to open Follower/Following lists */}
              <span><span className="font-semibold">{followerCount}</span> Followers</span>
              <span><span className="font-semibold">{followingUserCount}</span> Following</span>
            </div>
            <div className="text-xs text-neutral-500 mt-2"> {/* Changed text-gray-500 to text-neutral-500 */}
              <p><strong>Status:</strong> {userData.status || 'No status'}</p>
              <p><strong>Hobbies:</strong> {userData.hobbies || 'No hobbies listed'}</p>
              <p><strong>Pronouns:</strong> {userData.pronouns || 'Not set'}</p>
              <p><strong>Location:</strong> {userData.location || 'Unknown'}</p>
            </div>
          </div>
          {/* FollowButton integration */}
          {currentLoggedInUserId && currentLoggedInUserId !== userId && (
            <FollowButton
              targetId={userId}
              targetType="user"
              targetName={userData.displayName || 'this user'}
              onFollowStateChange={(isNowFollowing, countChange) => {
                // Update follower count on the public profile being viewed
                setFollowerCount(prev => prev + countChange);
                // Note: The button itself manages its isFollowing state.
                // The isFollowing state previously in this component for the button is removed.
              }}
            />
          )}
        </div>

        {/* Rest of the profile content (posts, answers, grupos) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-6"> {/* Main content: Posts and Answers */}
            <div>
              <h3 className="text-lg font-semibold text-coral mb-2">Recent Posts</h3>
              {posts.length > 0 ? (
                <ul className="space-y-4"> {/* Increased spacing for PostCard */}
                  {posts.map(post => (
                    // Assuming PostCard is self-contained and styled appropriately
                    <PostCard key={post.id} post={post} />
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-500 p-4 bg-white rounded-xl shadow">No posts yet.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-coral mb-2">Recent Quiz Answers</h3>
              {answers.length > 0 ? (
                <ul className="space-y-2">
                  {answers.map(answer => (
                    <li key={answer.id} className="p-4 bg-white rounded-xl shadow">
                      <p className="font-semibold text-sm text-neutral-700">Q: {answer.question}</p>
                      <p className="text-sm text-neutral-600">A: {answer.answer}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-500 p-4 bg-white rounded-xl shadow">No recent answers.</p>
              )}
            </div>
          </div>

          <div className="md:col-span-1 space-y-6"> {/* Sidebar content: Grupos */}
            <div>
              <h3 className="text-lg font-semibold text-coral mb-2">Grupos</h3>
              {grupos.length > 0 ? (
                <ul className="space-y-2">
                  {grupos.map(grupo => (
                    <li key={grupo.id} className="p-4 bg-white rounded-xl shadow">
                      <Link to={`/grupos/${grupo.id}`} className="font-bold text-coral hover:underline">{grupo.name}</Link>
                      <p className="text-xs text-neutral-600 mt-1 truncate">{grupo.description || 'No description'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-500 p-4 bg-white rounded-xl shadow">Not part of any grupos yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;