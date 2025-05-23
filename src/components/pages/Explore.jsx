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

  return (
    <div style={pageStyle} className="font-[Comfortaa] bg-transparent min-h-screen overflow-hidden relative z-0">
      <div className="absolute top-0 left-0 w-full h-full -z-[1000] bg-[#FF6B6B]" />
      <div style={bgEffect} className="absolute top-0 left-0 w-full h-full -z-[500] pointer-events-none">
        <FallingAEffect />
      </div>

      <header style={headerStyle} className="z-[10]">
        <img
          src="/assets/amigoshangouts1.png"
          alt="Amigos Hangouts"
          style={{ height: '20em', width: 'auto', animation: 'pulse-a 1.75s infinite', marginBottom: '-5rem' }}
          loading="lazy"
        />
      </header>

      <nav style={navWrapper} className="z-[10]">
        <div style={navStyle}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      <div style={mainCardWrapper} className="z-[10]">
        <div style={mainCardStyle}>
          <h2 style={sectionTitle}>Explore {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</h2>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={dropdownStyle}
          >
            <option value="amigos">Explore Amigos</option>
            <option value="grupos">Explore Grupos</option>
            <option value="events">Explore Events</option>
          </select>

          {isLoaded && (
            <div className="mt-6">
              <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
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

// Layout styles
const pageStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: 'transparent',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
};

const bgEffect = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '1rem',
  marginBottom: '-1rem',
};

const navWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '0rem',
  marginBottom: '1.5rem',
  zIndex: 0,
};

const navStyle = {
  backgroundColor: 'white',
  padding: '0.8rem 1rem',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  display: 'flex',
  gap: '1rem',
};

const tabStyle = {
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
};

const mainCardWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
  zIndex: 0,
};

const mainCardStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '1.5rem',
  boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
  width: '90%',
  maxWidth: '800px',
  minHeight: '60vh',
  textAlign: 'center',
  position: 'relative',
  zIndex: 0,
};

const sectionTitle = {
  fontSize: '2rem',
  color: '#FF6B6B',
  marginBottom: '1rem',
};

const dropdownStyle = {
  padding: '10px 16px',
  fontSize: '1rem',
  borderRadius: '30px',
  border: '1px solid #FF6B6B',
  fontFamily: 'Comfortaa, sans-serif',
  color: '#FF6B6B',
  cursor: 'pointer',
  marginBottom: '1rem',
};

export default Explore;
