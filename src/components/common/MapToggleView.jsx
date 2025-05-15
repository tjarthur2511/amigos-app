// src/components/common/MapToggleView.jsx
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
  overflow: 'hidden',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
};

const defaultCenter = { lat: 42.25, lng: -83.4 };
const defaultZoom = 10;

const MapToggleView = ({ type }) => {
  const dummyLocations = [
    { lat: 42.28, lng: -83.3, label: `${type} 1` },
    { lat: 42.23, lng: -83.5, label: `${type} 2` },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={defaultZoom}
        >
          {dummyLocations.map((loc, i) => (
            <Marker key={i} position={{ lat: loc.lat, lng: loc.lng }} label={loc.label} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapToggleView;
