// src/components/pages/Grupos/GruposPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import FallingAEffect from '../../common/FallingAEffect';
import SuggestedGrupos from './SuggestedGrupos';
import GruposUnidos from './GruposUnidos';
import GruposPosts from './GruposPosts';
import GrupoFormModal from './GrupoFormModal'; // Import GrupoFormModal
import { PlusCircleIcon } from '@heroicons/react/24/solid'; // Icon for create button

const GruposPage = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(1);
  const [isCreateGrupoModalOpen, setIsCreateGrupoModalOpen] = useState(false);
  const [userGrupos, setUserGrupos] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const feedCards = ['Suggested Grupos', 'Your Grupos', 'Your Grupos Posts'];

  useEffect(() => {
    const fetchGrupos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setCurrentUserId(user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { grupos = [] } = userSnap.data();
        setUserGrupos(grupos);
      }
    };
    fetchGrupos();
  }, []);

  const goToExplore = () => {
    navigate('/explore', { state: { from: 'grupos', defaultTab: 'grupos' } });
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % feedCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);

  // Define reused class strings (similar to AmigosPage)
  const tabClasses = "bg-coral text-white border-none py-3 px-5 rounded-[30px] text-base font-bold font-comfortaa cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-coral-dark transition-all";
  const standardButtonBase = "rounded-button bg-coral text-white font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out hover:bg-coral-dark active:bg-coral-dark/90 focus:outline-none focus:ring-2 focus:ring-coral-dark focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";
  const exploreButtonClasses = `${standardButtonBase} py-1.5 px-4 text-sm`; 
  const arrowButtonClasses = `${standardButtonBase} py-2 px-3 text-xl`;

  const renderCurrentFeed = () => {
    switch (feedCards[currentCard]) {
      case 'Suggested Grupos':
        return (
          <>
            <div className="flex justify-between mb-2">
              <button onClick={goToExplore} className={exploreButtonClasses}>Explore ➜</button>
            </div>
            <SuggestedGrupos gruposToExclude={userGrupos} />
          </>
        );
      case 'Your Grupos':
        return <GruposUnidos />;
      case 'Your Grupos Posts':
        return <GruposPosts />;
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
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-[800px] min-h-[60vh] text-center relative z-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl text-coral">{feedCards[currentCard]}</h2>
            {/* Render Create Grupo button only when 'Your Grupos' or 'Suggested Grupos' card is active */}
            {(feedCards[currentCard] === 'Your Grupos' || feedCards[currentCard] === 'Suggested Grupos') && (
              <button
                onClick={() => setIsCreateGrupoModalOpen(true)}
                className={`${standardButtonBase} py-2 px-4 text-sm flex items-center space-x-2`}
                title="Create New Grupo"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Create Grupo</span>
              </button>
            )}
          </div>
          {renderCurrentFeed()}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0">
            <button onClick={nextCard} className={arrowButtonClasses}>→</button>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-0">
            <button onClick={prevCard} className={arrowButtonClasses}>←</button>
          </div>
        </div>
      </div>
      <GrupoFormModal 
        isOpen={isCreateGrupoModalOpen} 
        onClose={() => setIsCreateGrupoModalOpen(false)} 
      />
    </div>
  );
};

// Style object constants are no longer needed.

export default GruposPage;