// src/components/common/GlobalSearch.jsx
import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const GlobalSearch = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const amigosRef = collection(db, "users");
    const gruposRef = collection(db, "grupos");

    const [amigosSnap, gruposSnap] = await Promise.all([
      getDocs(query(amigosRef, where("displayName", ">=", searchTerm))),
      getDocs(query(gruposRef, where("name", ">=", searchTerm))),
    ]);

    const amigoResults = amigosSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "amigo" }));
    const grupoResults = gruposSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "grupo" }));

    setResults([...amigoResults, ...grupoResults]);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000000,
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #FF6B6B",
            borderRadius: "9999px",
            padding: "0.5rem 1.5rem",
            fontSize: "0.95rem",
            color: "#FF6B6B",
            fontFamily: "Comfortaa, sans-serif",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#FF6B6B";
            e.target.style.color = "#FFFFFF";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#FFFFFF";
            e.target.style.color = "#FF6B6B";
          }}
        >
          Search Amigos & Grupos
        </button>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000001,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "1.5rem",
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              fontFamily: "Comfortaa, sans-serif",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "#FF6B6B",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#FF6B6B" }}>
              Search Amigos & Grupos
            </h2>

            <div style={{ display: "flex", marginBottom: "1rem" }}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name or keyword..."
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  border: "1px solid #ccc",
                  borderRadius: "9999px 0 0 9999px",
                  fontFamily: "Comfortaa, sans-serif",
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0 9999px 9999px 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Search
              </button>
            </div>

            <div>
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderBottom: "1px solid #eee",
                      color: "#333",
                    }}
                  >
                    <strong>{item.type.toUpperCase()}:</strong> {item.displayName || item.name}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#888" }}>No results yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
