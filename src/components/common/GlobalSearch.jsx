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

  // Define Tailwind classes
  const standardButtonBase = "rounded-full font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed";
  const primaryButtonClasses = `${standardButtonBase} bg-coral text-white hover:bg-coral-dark`;
  const iconPrimaryButtonClasses = `${primaryButtonClasses} p-2 text-lg`; // For small icon buttons

  const searchButtonTriggerClasses = `${primaryButtonClasses} py-2 px-6 text-sm`; // Main trigger button
  const modalOverlayClasses = "fixed inset-0 w-screen h-screen bg-black/60 flex items-center justify-center z-[1000001] font-comfortaa"; // Added font-comfortaa here
  const modalContainerClasses = "bg-white p-8 rounded-[1.5rem] w-[90%] max-w-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative";
  const closeModalButtonClasses = `absolute top-3 right-3 ${iconPrimaryButtonClasses}`; // Standardized close button
  const modalTitleClasses = "text-center mb-4 text-coral text-xl font-bold";
  const searchInputClasses = "flex-1 py-2 px-4 border border-gray-300 rounded-l-full font-comfortaa focus:ring-1 focus:ring-coral focus:border-coral outline-none";
  // Search button in input group: kept specific shape but applied primary color scheme
  const searchGroupButtonClasses = `bg-coral text-white py-2 px-4 border-none rounded-r-full cursor-pointer font-comfortaa font-bold hover:bg-coral-dark transition-colors shadow-sm`; 
  const resultItemClasses = "py-2 px-3 border-b border-gray-200 text-charcoal";
  const noResultClasses = "text-center text-gray-500";

  return (
    <>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000000] pointer-events-auto">
        <button
          onClick={() => setShowModal(true)}
          className={searchButtonTriggerClasses}
        >
          Search Amigos & Grupos
        </button>
      </div>

      {showModal && (
        <div className={modalOverlayClasses}>
          <div className={modalContainerClasses}>
            <button
              onClick={() => setShowModal(false)}
              className={closeModalButtonClasses}
            >
              ✕
            </button>

            <h2 className={modalTitleClasses}>
              Search Amigos & Grupos
            </h2>

            <div className="flex mb-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name or keyword..."
                className={searchInputClasses}
              />
              <button
                onClick={handleSearch}
                className={searchGroupButtonClasses} // Updated to searchGroupButtonClasses
              >
                Search
              </button>
            </div>

            <div>
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={item.id}
                    className={resultItemClasses}
                  >
                    <strong className="text-coral">{item.type.toUpperCase()}:</strong> {item.displayName || item.name}
                  </div>
                ))
              ) : (
                <p className={noResultClasses}>No results yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
