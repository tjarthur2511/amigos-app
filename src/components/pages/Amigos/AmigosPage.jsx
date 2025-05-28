// ✅ Cleaned AmigosPage – Explore ➜ now navigates to Explore.jsx with correct tab
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import FallingAEffect from '../../common/FallingAEffect';
import SuggestedAmigos from './SuggestedAmigos';
import AmigosUnidos from './AmigosUnidos';
import AmigosPosts from './AmigosPosts';

const AmigosPage = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(1);
  const [userFollowing, setUserFollowing] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const feedCards = ['Suggested Amigos', 'Followed Amigos', 'Your Amigos Posts'];

  useEffect(() => {
    const fetchFollowing = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setCurrentUserId(user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { following = [] } = userSnap.data();
        setUserFollowing(following);
      }
    };
    fetchFollowing();
  }, []);

  const goToExplore = () => {
    navigate('/explore', { state: { from: 'amigos' } });
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % feedCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);

  // Define reused class strings
  const tabClasses = "bg-coral text-white border-none py-3 px-5 rounded-[30px] text-base font-bold font-comfortaa cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-coral-dark transition-all";
  const exploreButtonClasses = "bg-white text-coral border border-coral rounded-[30px] py-1 px-3 text-sm cursor-pointer font-comfortaa hover:bg-coral hover:text-white transition-colors";
  const arrowButtonClasses = "text-2xl bg-coral text-white border-none rounded-full py-2 px-4 cursor-pointer hover:bg-coral-dark transition-colors";


  const renderCurrentFeed = () => {
    switch (feedCards[currentCard]) {
      case 'Suggested Amigos':
        return (
          <>
            <div className="flex justify-between mb-2">
              <button onClick={goToExplore} className={exploreButtonClasses}>Explore ➜</button>
            </div>
            <SuggestedAmigos amigosToExclude={userFollowing} />
          </>
        );
      case 'Followed Amigos':
        return <AmigosUnidos />;
      case 'Your Amigos Posts':
        return <AmigosPosts />;
      default:
        return null;
    }
  };

  return (
    <div className="font-comfortaa bg-transparent min-h-screen overflow-hidden relative z-0">
      <div className="absolute top-0 left-0 w-full h-full -z-[1000] bg-coral" /> {/* Ensure this is coral */}
      <div className="absolute top-0 left-0 w-full h-full -z-[500] pointer-events-none">
        <FallingAEffect />
      </div>

      <header className="flex justify-center pt-4 mb-[-1rem] z-[10]">
        <img
          src="/assets/amigoshangouts1.png"
          alt="Amigos Hangouts"
          className="h-[20em] w-auto animate-[pulse-a_1.75s_infinite] mb-[-5rem]"
        />
      </header>

      <nav className="flex justify-center mt-0 mb-6 z-[10]">
        <div className="bg-white py-3 px-4 rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex gap-4">
          <button onClick={() => navigate('/')} className={tabClasses}>Home</button>
          <button onClick={() => navigate('/amigos')} className={tabClasses}>Amigos</button>
          <button onClick={() => navigate('/grupos')} className={tabClasses}>Grupos</button>
          <button onClick={() => navigate('/profile')} className={tabClasses}>Profile</button>
        </div>
      </nav>

      <div className="flex justify-center mb-8 z-[10]">
        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[800px] min-h-[60vh] text-center relative z-0">
          <h2 className="text-3xl text-coral mb-4">{feedCards[currentCard]}</h2>
          {renderCurrentFeed()}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0">
            <button onClick={nextCard} className={arrowButtonClasses}>→</button>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-0">
            <button onClick={prevCard} className={arrowButtonClasses}>←</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Style object constants are no longer needed.

export default AmigosPage;
