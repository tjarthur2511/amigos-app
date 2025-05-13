// src/components/pages/MapHangoutsPage.jsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import FallingAEffect from '../FallingAEffect';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
};

const center = {
  lat: 42.3314, // Detroit
  lng: -83.0458,
};

const MapHangoutsPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, 'events'));
      const eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    };
    fetchEvents();
  }, []);

  const getPinIcon = (type) => {
    switch (type) {
      case 'amigo': return '/assets/amigosaonly.png';
      case 'grupo': return '/assets/g-logo.png';
      case 'event': return '/assets/e-logo.png';
      default: return '/assets/amigosaonly.png';
    }
  };

  return (
    <div style={pageStyle}>
      <div style={bgEffect}><FallingAEffect /></div>

      <header style={headerStyle}>
        <h1 style={titleStyle}>map hangouts</h1>
      </header>

      <div style={mainCardWrapper}>
        <div style={mainCardStyle}>
          <h2 style={sectionTitle}>Hangouts Near You</h2>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            >
              {events.map((event) => (
                <Marker
                  key={event.id}
                  position={{ lat: event.lat, lng: event.lng }}
                  icon={{
                    url: getPinIcon(event.type),
                    scaledSize: new window.google.maps.Size(32, 32),
                  }}
                  title={event.title || 'Untitled'}
                />
              ))}
            </GoogleMap>
          ) : (
            <p style={comingSoonText}>Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: '#FF6B6B',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative'
};

const bgEffect = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none'
};

const headerStyle = {
  textAlign: 'center',
  paddingTop: '2rem'
};

const titleStyle = {
  fontSize: '3.5rem',
  color: 'white'
};

const mainCardWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
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
  zIndex: 10
};

const sectionTitle = {
  fontSize: '2rem',
  color: '#FF6B6B',
  marginBottom: '1.5rem'
};

const comingSoonText = {
  fontSize: '1.2rem',
  color: '#FF6B6B'
};

export default MapHangoutsPage;
