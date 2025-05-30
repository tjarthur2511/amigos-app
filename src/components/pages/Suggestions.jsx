// src/components/pages/Suggestions.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import Spinner from '../common/Spinner';
import SuggestedAmigosCard from '../common/SuggestedAmigosCard'; // Assuming this can be reused or adapted
import SuggestedGruposCard from '../common/SuggestedGruposCard'; // Assuming this can be reused or adapted
import { useNotification } from '../../context/NotificationContext.jsx';

// Simple keyword extraction and matching (very basic)
const extractKeywords = (text) => {
  if (!text || typeof text !== 'string') return [];
  const commonWords = new Set(['a', 'an', 'the', 'is', 'to', 'and', 'in', 'it', 'my', 'i', 'do', 'for', 'of', 'on', 'with', 's', 'like', 'love', 'enjoy', 'prefer', 'favorite', 'what', 'which', 'how', 'new', 'go', 'to', 'good', 'kind']);
  return text.toLowerCase().split(/\s+/)
    .map(word => word.replace(/[^\w\s]/gi, '')) // Remove punctuation
    .filter(word => word.length > 2 && !commonWords.has(word));
};

const getMatchScore = (userKeywords, targetKeywords) => {
  if (!userKeywords || !targetKeywords || userKeywords.length === 0 || targetKeywords.length === 0) return 0;
  const intersection = userKeywords.filter(keyword => targetKeywords.includes(keyword));
  return intersection.length;
};

// Key questions for matching
const AMIGO_MATCH_KEYS = ['q2', 'q4', 'q6', 'q10']; // Activities, Outdoors, Games, Topics
const GRUPO_MATCH_KEYS = ['q1', 'q2', 'q4', 'q5', 'q6', 'q7', 'q10']; // Relax, Activities, Outdoors, Skills, Games, Creative, Topics

const Suggestions = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [currentUserQuizAnswers, setCurrentUserQuizAnswers] = useState(null);
  const [suggestedAmigos, setSuggestedAmigos] = useState([]);
  const [suggestedGrupos, setSuggestedGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUserId = auth.currentUser?.uid;

  const generateSuggestions = useCallback(async (quizAnswers) => {
    if (!quizAnswers || Object.keys(quizAnswers).length === 0) {
      setError("Please complete your profile quiz to get suggestions.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      // --- Suggest Amigos ---
      const userKeywordsForAmigos = {};
      AMIGO_MATCH_KEYS.forEach(key => {
        userKeywordsForAmigos[key] = extractKeywords(quizAnswers[key]);
      });

      const usersRef = collection(db, 'users');
      // Fetch recent users, exclude current user later.
      // In a real app, you'd want more sophisticated filtering (location, common interests from tags, etc.)
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'), limit(50));
      const usersSnapshot = await getDocs(usersQuery);
      const potentialAmigos = [];

      usersSnapshot.forEach(doc => {
        if (doc.id === currentUserId) return;
        const userData = doc.data();
        if (userData.quizAnswers) {
          let totalScore = 0;
          AMIGO_MATCH_KEYS.forEach(key => {
            const targetKeywords = extractKeywords(userData.quizAnswers[key]);
            totalScore += getMatchScore(userKeywordsForAmigos[key], targetKeywords);
          });
          if (totalScore > 0) { // Require at least some match
            potentialAmigos.push({ ...userData, id: doc.id, matchScore: totalScore });
          }
        }
      });
      potentialAmigos.sort((a, b) => b.matchScore - a.matchScore);
      setSuggestedAmigos(potentialAmigos.slice(0, 5));

      // --- Suggest Grupos ---
      let userKeywordsForGrupos = [];
      GRUPO_MATCH_KEYS.forEach(key => {
        userKeywordsForGrupos.push(...extractKeywords(quizAnswers[key]));
      });
      userKeywordsForGrupos = [...new Set(userKeywordsForGrupos)]; // Unique keywords

      const gruposRef = collection(db, 'grupos');
      // Fetch recent groups.
      const gruposQuery = query(gruposRef, orderBy('createdAt', 'desc'), limit(50));
      const gruposSnapshot = await getDocs(gruposQuery);
      const potentialGrupos = [];

      gruposSnapshot.forEach(doc => {
        const grupoData = doc.data();
        const grupoNameKeywords = extractKeywords(grupoData.name);
        const grupoDescKeywords = extractKeywords(grupoData.description); // Assuming description field exists
        
        let score = getMatchScore(userKeywordsForGrupos, grupoNameKeywords) * 2; // Weight name matches higher
        score += getMatchScore(userKeywordsForGrupos, grupoDescKeywords);

        if (score > 0) {
          potentialGrupos.push({ ...grupoData, id: doc.id, matchScore: score });
        }
      });
      potentialGrupos.sort((a, b) => b.matchScore - a.matchScore);
      setSuggestedGrupos(potentialGrupos.slice(0, 5));

    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError("Could not generate suggestions at this time. Please try again later.");
      showNotification("Error generating suggestions.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, showNotification]);

  useEffect(() => {
    if (!currentUserId) {
      navigate('/login'); // Should have user to get suggestions
      return;
    }
    const fetchCurrentUserQuizAnswers = async () => {
      const userRef = doc(db, 'users', currentUserId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().quizAnswers) {
        const answers = userSnap.data().quizAnswers;
        setCurrentUserQuizAnswers(answers);
        generateSuggestions(answers);
      } else {
        setError("Please complete your profile quiz to get suggestions.");
        setIsLoading(false);
        // Optionally redirect to quiz page if no answers found
        // navigate('/setup-quiz'); 
      }
    };
    fetchCurrentUserQuizAnswers();
  }, [currentUserId, navigate, generateSuggestions]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-coral to-peach p-4 sm:p-8 font-comfortaa text-charcoal">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12 filter drop-shadow-md">
          Here are some suggestions for you!
        </h1>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" color="white" />
            <p className="ml-4 text-white text-xl">Finding your Amigos & Grupos...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center bg-white/80 p-8 rounded-xl shadow-xl">
            <p className="text-feedback-error text-lg">{error}</p>
            <button 
              onClick={() => navigate('/profile')} 
              className="mt-6 bg-coral text-white py-2.5 px-6 rounded-button font-bold hover:bg-coral-dark transition-colors"
            >
              Go to Profile
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Suggested Amigos Section */}
            <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-coral mb-6 text-center">Suggested Amigos</h2>
              {suggestedAmigos.length > 0 ? (
                <div className="space-y-4">
                  {suggestedAmigos.map(user => (
                    // Assuming SuggestedAmigosCard takes user data as prop
                    // If not, adapt to a simpler display for now
                    <SuggestedAmigosCard key={user.id} amigo={user} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-600">No Amigo suggestions right now. We'll keep looking!</p>
              )}
            </section>

            {/* Suggested Grupos Section */}
            <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-coral mb-6 text-center">Suggested Grupos</h2>
              {suggestedGrupos.length > 0 ? (
                <div className="space-y-4">
                  {suggestedGrupos.map(grupo => (
                    // Assuming SuggestedGruposCard takes grupo data as prop
                    <SuggestedGruposCard key={grupo.id} grupo={grupo} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-600">No Grupo suggestions right now. Explore or create one!</p>
              )}
            </section>
          </div>
        )}
         <div className="mt-12 text-center">
            <button
                onClick={() => navigate('/')}
                className="bg-white text-coral py-3 px-8 rounded-button font-bold text-lg hover:bg-neutral-100 transition-colors shadow-md"
            >
                Go to Home
            </button>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
