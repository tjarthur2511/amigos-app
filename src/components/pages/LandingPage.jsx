import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FallingAEffect from "../common/FallingAEffect";
import { signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth"; // Import persistence types
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import InlineNotification from "../common/InlineNotification"; // Import the notification component

const LandingPage = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notification
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State for login loading

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true); // Start loading
    setNotification({ message: '', type: '' }); // Clear previous notifications
    try {
      // Set persistence based on rememberMe state
      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setNotification({ message: "User data not found in Firestore.", type: 'error' });
        return;
      }

      navigate("/");
    } catch (error) {
      setNotification({ message: "Login failed: " + error.message, type: 'error' });
    } finally {
      setIsLoggingIn(false); // Stop loading
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Define input style as a Tailwind string to reuse
  const inputClasses = "p-[0.5em] border border-gray-300 rounded-[0.5em] font-comfortaa text-base w-full box-border";

  return (
    <div className="min-h-screen relative overflow-hidden w-full font-comfortaa">
      <FallingAEffect />

      <div className="relative z-[5]">
        {/* Main Card */}
        <div className="flex flex-col items-center justify-center gap-8 pt-16 pb-16">
          <div className="bg-white p-8 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] w-[90%] max-w-[500px] text-center">
            <div className="mb-4">
              <img
                src="/assets/amigoshangouts1.png"
                alt="Amigos Logo"
                className="h-[20em] w-auto mb-[-7rem] animate-[pulse-a_1.75s_infinite] mx-auto" // Added mx-auto for centering if parent is text-center
              />
            </div>

            <p className="text-lg text-gray-600 mb-8"> {/* Assuming #555 is a shade of gray, using gray-600 */}
              Find your place. Find your passion. Find your amigos
            </p>

            <button
              onClick={handleGetStarted}
              className="bg-coral text-white py-3 px-6 rounded-full font-comfortaa font-bold text-base cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-coral-dark" // Applied new standard style
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div
          className={`bg-white p-[0.8em] rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] w-[14em] text-center text-[0.8em] ${
            isMobile ? "relative mx-auto mt-8" : "absolute top-[30px] right-[30px]" // Added mx-auto and mt-8 for mobile layout
          }`}
        >
          <h2 className="text-[1.4em] text-coral mb-[0.5em]">
            Login
          </h2>
          {notification.message && (
            <div className="my-2"> {/* Added margin for notification spacing */}
              <InlineNotification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
              />
            </div>
          )}
          <form onSubmit={handleLogin} className={`flex flex-col gap-[0.6em] ${notification.message ? 'mt-[0.5em]' : ''}`}>
            <input
              type="text"
              placeholder="Username or Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className={inputClasses}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className={inputClasses}
            />

            <label className="text-[0.75em] flex items-center"> {/* Added flex and items-center for alignment */}
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="mr-2" // Replaced style with Tailwind margin
              />
              Show Password
            </label>

            <label className="text-[0.75em] flex items-center"> {/* Added flex and items-center for alignment */}
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2" // Replaced style with Tailwind margin
              />
              Remember Me
            </label>

            <button
              type="submit"
              className="bg-coral text-white p-[0.6em_1em] rounded-full font-comfortaa font-bold text-base cursor-pointer transition-all duration-200 ease-in-out shadow-md w-full hover:bg-coral-dark disabled:opacity-70" // Applied new standard style
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// inputStyle constant is no longer needed as its Tailwind equivalent is used directly or via inputClasses.

export default LandingPage;
