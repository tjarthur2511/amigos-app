import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import FallingAEffect from '../common/FallingAEffect';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false); // State for signup loading
  const [passwordStrength, setPasswordStrength] = useState(''); // State for password strength

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsSigningUp(true); // Start loading

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSigningUp(false); // Stop loading on validation error
      return;
    }

    if (calculateAge(dob) < 13) {
      setError('You must be at least 13 years old to join amigos.');
      setIsSigningUp(false); // Stop loading on validation error
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      await auth.currentUser?.reload();
      const user = auth.currentUser;

      if (!user) {
        setError('Authentication failed. Please try again.');
        return;
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        email,
        dob,
        createdAt: serverTimestamp(),
        quizAnswers: {},
        monthlyQuiz: {},
        amigos: [],
        grupos: [],
        preferences: {},
        isAdmin: false,
      });

      navigate('/setup');
    } catch (err) {
      setError(err.message || 'Sign-up failed');
    } finally {
      setIsSigningUp(false); // Stop loading
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (length < 8) return 'Weak';
    if (length >= 8 && ((hasLower && !hasUpper && !hasNumber && !hasSymbol) || (!hasLower && hasUpper && !hasNumber && !hasSymbol) || (!hasLower && !hasUpper && hasNumber && !hasSymbol))) return 'Medium';
    if (length >= 8 && (hasLower || hasUpper) && hasNumber && (hasSymbol || (!hasSymbol && (hasLower || hasUpper) && hasNumber))) return 'Strong'; // Strong if it has letters, numbers, and optionally symbols or just a good mix
    if (length >= 8 && (hasLower || hasUpper) && hasNumber) return 'Medium'; // Covers cases like only letters and numbers
    return 'Weak'; // Default to weak if other conditions not met
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const getStrengthColor = (strength) => {
    if (strength === 'Weak') return 'text-red-500';
    if (strength === 'Medium') return 'text-orange-500';
    if (strength === 'Strong') return 'text-green-500';
    return 'text-gray-500'; // Default or for empty string
  };

  const inputClasses = "p-3 border border-gray-300 rounded-[10px] font-comfortaa text-base outline-none w-full"; // Added w-full

  return (
    <div className="min-h-screen relative overflow-hidden w-full font-comfortaa">
      {/* 🔴 Falling A Effect */}
      <div className="fixed top-0 left-0 w-screen h-screen z-[-500] pointer-events-none">
        <FallingAEffect />
      </div>

      {/* 🔴 Sign Up Card */}
      <div className="relative z-[5]">
        <div className="flex flex-col items-center justify-center gap-8 pt-16 pb-16">
          <div className="bg-white p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] w-[90%] max-w-[500px] text-center">
            <h2 className="text-2xl text-coral mb-4 font-sans"> {/* Adjusted font size, using Tailwind's text-2xl for 1.8rem approx. */}
              Join <span className="font-comfortaa">a</span>migos
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-2.5 rounded-lg mb-4 font-comfortaa text-sm"> {/* Tailwind classes for error message */}
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className={inputClasses}
              />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
              />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password (8+ characters, mix types)"
                value={password}
                onChange={handlePasswordChange} // Updated onChange handler
                required
                className={inputClasses}
              />
              {passwordStrength && (
                <p className={`text-xs mt-1 ${getStrengthColor(passwordStrength)}`}>
                  Password Strength: {passwordStrength}
                </p>
              )}
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClasses}
              />
              <input
                id="dob"
                name="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className={inputClasses} // Applied common input classes
              />
              <button
                type="submit"
                className="bg-coral text-white py-3 px-6 rounded-full font-comfortaa font-bold text-base cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-coral-dark disabled:opacity-70" // Applied new standard style
                disabled={isSigningUp}
              >
                {isSigningUp ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// inputStyle constant is no longer needed

export default SignUpPage;
