// src/components/common/MapToggleView.jsx
import React from "react";
import GoogleMapReact from "google-map-react";

const Marker = ({ text }) => (
  <div className="text-xs bg-white text-black px-2 py-1 rounded-full shadow">{text}</div>
);

const MapToggleView = ({ type }) => {
  const defaultCenter = { lat: 42.25, lng: -83.4 };
  const defaultZoom = 10;

  // This mock should be replaced with real filtered Firestore data later
  const dummyLocations = [
    { lat: 42.28, lng: -83.3, label: `${type} 1` },
    { lat: 42.23, lng: -83.5, label: `${type} 2` },
  ];

  return (
    <div className="h-[300px] w-full mb-4 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "YOUR_GOOGLE_MAPS_API_KEY" }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
        {dummyLocations.map((loc, idx) => (
          <Marker key={idx} lat={loc.lat} lng={loc.lng} text={loc.label} />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default MapToggleView;
