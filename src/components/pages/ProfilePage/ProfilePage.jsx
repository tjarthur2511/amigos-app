// ✅ Full ProfilePage.jsx – Follower Count + FollowersList Preserved
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import ProfileCard from './ProfileCard';
import ProfileQuestionsCenter from './ProfileQuestionsCenter';
import ProfilePhotos from './ProfilePhotos';
import FallingAEffect from '../../common/FallingAEffect';
import FollowersList from './FollowersList';
import Spinner from '../../common/Spinner'; // Import Spinner
import NotificationSettings from './NotificationSettings'; // Import NotificationSettings
import { useNotification } from '../../../context/NotificationContext.jsx'; // Import useNotification

const ProfilePage = () => {
  const { showNotification } = useNotification(); // Initialize useNotification
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Added loading state for initial profile fetch
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [status, setStatus] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [location, setLocation] = useState('');
  const [background, setBackground] = useState('');
  const [saving, setSaving] = useState(false); // This is for the save button
  const [followerCount, setFollowerCount] = useState(0); // Own followers
  const [followingUserCount, setFollowingUserCount] = useState(0); // How many users current user is following
  const [followingGrupoCount, setFollowingGrupoCount] = useState(0); // How many grupos current user is following

  // Added 'Notification Settings' to profileCards
  const profileCards = ['Your Profile', 'Quiz Questions', 'Your Photos', 'Notification Settings'];

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingProfile(true); // Start loading before fetch
      const user = auth.currentUser;
      if (!user) {
        setIsLoadingProfile(false); // Stop loading if no user
        return;
      }

      setUserId(user.uid);
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || 'Unnamed Amigo');
        setIsAdmin(data.isAdmin || false);
        setBio(data.bio || '');
        setHobbies(data.hobbies || '');
        setStatus(data.status || '');
        setPronouns(data.pronouns || '');
        setLocation(data.location || '');
        setBackground(data.background || '');
      }

      const allUsersSnap = await getDocs(collection(db, 'users'));
      // Fetch follower count for the current user
      const ownFollowersRef = collection(db, 'users', user.uid, 'followers');
      const ownFollowersSnap = await getDocs(ownFollowersRef);
      setFollowerCount(ownFollowersSnap.size);

      // Fetch how many users the current user is following
      const ownFollowingUsersRef = collection(db, 'users', user.uid, 'followingUsers');
      const ownFollowingUsersSnap = await getDocs(ownFollowingUsersRef);
      setFollowingUserCount(ownFollowingUsersSnap.size);

      // Fetch how many grupos the current user is following
      const ownFollowingGruposRef = collection(db, 'users', user.uid, 'followingGrupos');
      const ownFollowingGruposSnap = await getDocs(ownFollowingGruposRef);
      setFollowingGrupoCount(ownFollowingGruposSnap.size);

      setIsLoadingProfile(false); // Stop loading after all fetches
    };
    fetchUser();
  }, [userId]); // Added userId to dependency array as it's used in fetchUser

  const handleSavePublicProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        displayName,
        bio,
        hobbies,
        status,
        pronouns,
        location,
        background,
      });
      setSaving(false);
      showNotification("Profile saved successfully!", "success");
    } catch (error) {
      console.error("Error saving profile: ", error);
      setSaving(false);
      showNotification("Failed to save profile. Please try again.", "error");
    }
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % profileCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + profileCards.length) % profileCards.length);

  const sectionTitleClasses = "text-3xl text-coral mb-4 text-center";
  const tabClasses = "bg-coral text-white border-none py-3 px-5 rounded-[30px] text-base font-bold font-comfortaa cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-coral-dark transition-all";
  const arrowButtonClasses = "rounded-full bg-coral text-white font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out hover:bg-coral-dark disabled:opacity-70 disabled:cursor-not-allowed py-2 px-3 text-xl";
  const adminButtonClasses = "rounded-full bg-coral text-white font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out hover:bg-coral-dark disabled:opacity-70 disabled:cursor-not-allowed py-2.5 px-5 text-sm";
  const profileFormButtonClasses = "rounded-full bg-coral text-white font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out hover:bg-coral-dark disabled:opacity-70 disabled:cursor-not-allowed py-3 px-8 text-base";
  const formInputClasses = "w-full border border-coral rounded-full px-5 py-3 text-sm text-center bg-white shadow-sm shadow-coral/50 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent";
  const formTextareaClasses = "w-full border border-coral rounded-xl px-5 py-3 text-sm text-center bg-white shadow-sm shadow-coral/50 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent resize-y";
  const formSelectClasses = "w-full border border-coral rounded-full px-5 py-3 text-sm text-center bg-white shadow-sm shadow-coral/50 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent";

  const renderCardContent = () => {
    switch (profileCards[currentCard]) {
      case 'Your Profile':
        return (
          <>
            <h2 className={sectionTitleClasses}>Customize Your Public Profile</h2>
            <div className="text-center text-sm text-neutral-600 mb-4 space-x-4">
              <span><span className="font-bold text-coral">{followerCount}</span> Followers</span>
              <span><span className="font-bold text-coral">{followingUserCount}</span> Following Users</span>
              <span><span className="font-bold text-coral">{followingGrupoCount}</span> Following Grupos</span>
            </div>
            <div className="max-w-md mx-auto space-y-5 pt-4">
              {[{ label: 'Display Name', value: displayName, setter: setDisplayName, type: 'input' },
              { label: 'Bio', value: bio, setter: setBio, type: 'textarea' },
              { label: 'Hobbies', value: hobbies, setter: setHobbies, type: 'textarea' },
              { label: 'Status', value: status, setter: setStatus, type: 'input' },
              { label: 'Pronouns', value: pronouns, setter: setPronouns, type: 'input' },
              { label: 'Location', value: location, setter: setLocation, type: 'input' }].map(
                ({ label, value, setter, type }) => (
                  <div key={label} className="text-center">
                    <label className="block text-sm text-gray-700 mb-1 text-center font-medium">{label}</label>
                    {type === 'textarea' ? (
                      <textarea
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className={formTextareaClasses}
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className={formInputClasses}
                      />
                    )}
                  </div>
                )
              )}
              <div className="text-center mb-4">
                <label className="block text-sm text-gray-700 mb-1 text-center font-medium">Profile Background</label>
                <select
                  value={background || ''}
                  onChange={(e) => setBackground(e.target.value)}
                  className={formSelectClasses}
                >
                  <option value="">Default Coral</option>
                  <option value="blush">🌸 Blush Pink</option>
                  <option value="beach">🏖️ Beach Vibes</option>
                  <option value="city">🌆 Urban Skyline</option>
                  <option value="forest">🌲 Nature Escape</option>
                  <option value="galaxy">🌌 Galaxy Mode</option>
                </select>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={handleSavePublicProfile} 
                  className={`${profileFormButtonClasses} flex items-center justify-center`} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    '💾 Save Profile'
                  )}
                </button>
                <button 
                  onClick={() => navigate(`/profile/${userId}`)} 
                  className={profileFormButtonClasses}
                  disabled={saving}
                >
                  🔍 View Public Profile
                </button>
              </div>
              <FollowersList userId={userId} />
            </div>
          </>
        );
      case 'Quiz Questions':
        return <ProfileQuestionsCenter />;
      case 'Your Photos':
        return (
          <>
            <h2 className={sectionTitleClasses}>📸 Your Photos</h2>
            <ProfilePhotos />
          </>
        );
      case 'Notification Settings':
        return <NotificationSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="font-comfortaa bg-transparent min-h-screen overflow-hidden relative z-0">
      <div className="absolute top-0 left-0 w-full h-full -z-[1000] bg-coral" />
      <div className="absolute top-0 left-0 w-full h-full -z-[500] pointer-events-none">
        <FallingAEffect />
      </div>

      <header className="flex justify-center pt-4 mb-[-1rem] z-[10]">
        <img src="/assets/amigoshangouts1.png" alt="Amigos Hangouts" className="h-[20em] w-auto animate-[pulse-a_1.75s_infinite] mb-[-5rem]" />
      </header>

      <nav className="flex justify-center mt-0 mb-6 z-[10]">
        <div className="bg-white py-3 px-4 rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex gap-4">
          <button onClick={() => navigate('/')} className={tabClasses}>Home</button>
          <button onClick={() => navigate('/amigos')} className={tabClasses}>Amigos</button>
          <button onClick={() => navigate('/grupos')} className={tabClasses}>Grupos</button>
          <button onClick={() => navigate('/profile')} className={tabClasses}>Profile</button>
        </div>
      </nav>

      {isAdmin && (
        <div className="absolute top-[105px] right-[40px] z-50">
          <button onClick={() => navigate('/profile/admin')} className={adminButtonClasses}>
            🛠️ Admin Panel
          </button>
        </div>
      )}

      <div className="flex justify-center mb-8 z-[10]">
        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[800px] min-h-[60vh] text-center relative z-0">
          {isLoadingProfile ? (
            <div className="flex justify-center items-center h-40">
              <Spinner size="lg" color="coral" />
            </div>
          ) : (
            <>
              {profileCards[currentCard] !== 'Your Profile' && 
               profileCards[currentCard] !== 'Your Photos' &&
               profileCards[currentCard] !== 'Notification Settings' && (
                <h2 className={sectionTitleClasses}>{profileCards[currentCard]}</h2>
              )}
              {renderCardContent()}
            </>
          )}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0">
            <button onClick={nextCard} className={arrowButtonClasses} disabled={isLoadingProfile}>→</button>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-0">
            <button onClick={prevCard} className={arrowButtonClasses} disabled={isLoadingProfile}>←</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;