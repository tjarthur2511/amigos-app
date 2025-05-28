import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import FallingAEffect from '../common/FallingAEffect';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
};

const center = {
  lat: 42.25,
  lng: -83.4,
};

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState('amigos');
  const [mapMarkers, setMapMarkers] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (location.state?.defaultTab) {
      setSelectedType(location.state.defaultTab);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMarkers = async () => {
      let col = selectedType === 'amigos' ? 'users' : selectedType === 'grupos' ? 'grupos' : 'events';

      const ref = collection(db, col);
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = data.filter((item) => item.lat && item.lng);
      setMapMarkers(filtered);
    };

    fetchMarkers();
  }, [selectedType]);

  // Define reused class strings
  const tabClasses = "bg-coral text-white border-none py-3 px-5 rounded-[30px] text-base font-bold font-comfortaa cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-coral-dark transition-all";
  const sectionTitleClasses = "text-3xl text-coral mb-4 text-center"; // Adjusted from 2rem to 3xl
  const dropdownClasses = "py-2.5 px-4 text-base rounded-full border border-coral font-comfortaa text-coral cursor-pointer mb-4 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent";
  const mapContainerClasses = "w-full h-[400px] rounded-xl"; // For GoogleMap mapContainerStyle

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
        <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[800px] min-h-[60vh] text-center relative z-0">
          <h2 className={sectionTitleClasses}>Explore {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</h2>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={dropdownClasses}
          >
            <option value="amigos">Explore Amigos</option>
            <option value="grupos">Explore Grupos</option>
            <option value="events">Explore Events</option>
          </select>

          {isLoaded && (
            <div className="mt-6">
              {/* Ensure mapContainerClassName is used if available, otherwise pass style directly */}
              <GoogleMap mapContainerClassName={mapContainerClasses} mapContainerStyle={{width: '100%', height: '400px', borderRadius: '1rem'}} center={center} zoom={10}>
                {mapMarkers.map((m) => (
                  <Marker key={m.id} position={{ lat: m.lat, lng: m.lng }} />
                ))}
              </GoogleMap>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Style object constants are no longer needed.

export default Explore;
