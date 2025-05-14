import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FallingAEffect from "../common/FallingAEffect";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const LandingPage = () => {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User data not found in Firestore.");
        return;
      }

      navigate("/");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      fontFamily: "Comfortaa, sans-serif"
    }}>
      <FallingAEffect />

      <div style={{ position: "relative", zIndex: 5 }}>
        {/* Main Card */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            width: "90%",
            maxWidth: "500px",
            textAlign: "center",
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <img
                src="/assets/amigoshangouts1.png"
                alt="amigos logo"
                style={{
                  height: "15em",
                  width: "auto",
                  marginBottom: "-4rem",
                  animation: "pulse-a 1.75s infinite"
                }}
              />
            </div>

            <p style={{
              fontSize: "1.2rem",
              color: "#555",
              marginBottom: "2rem"
            }}>
              Find your place. Find your passion. Find your amigos
            </p>

            <button
              onClick={handleGetStarted}
              style={{
                backgroundColor: "#FF6B6B",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "30px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#e15555"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#FF6B6B"}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: "white",
          padding: "0.8em",
          borderRadius: "1rem",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          width: "14em",
          position: isMobile ? "relative" : "absolute",
          top: isMobile ? "auto" : "30px",
          right: isMobile ? "auto" : "30px",
          textAlign: "center",
          fontSize: "0.8em",
        }}>
          <h2 style={{
            fontSize: "1.4em",
            color: "#FF6B6B",
            marginBottom: "0.5em"
          }}>
            Login
          </h2>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.6em" }}>
            <input
              type="text"
              placeholder="Username or Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              style={inputStyle}
            />

            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Show Password
            </label>

            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Remember Me
            </label>

            <button
              type="submit"
              style={{
                backgroundColor: "#FF6B6B",
                color: "white",
                border: "none",
                padding: "0.6em 1em",
                borderRadius: "30px",
                fontSize: "1em",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                width: "100%",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#e15555"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#FF6B6B"}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "0.5em",
  border: "1px solid #ccc",
  borderRadius: "0.5em",
  fontFamily: "Comfortaa, sans-serif",
  fontSize: "1em",
  width: "100%",
  boxSizing: "border-box",
};

export default LandingPage;
