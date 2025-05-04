import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import FallingAEffect from '../FallingAEffect';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
};

const center = {
  lat: 42.3314, // Default to Detroit, MI
  lng: -83.0458,
};

const MapHangoutsPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // 🔑 Auto-filled
  });

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
            />
          ) : (
            <p style={comingSoonText}>Loading map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles (unchanged)
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
