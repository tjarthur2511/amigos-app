// src/components/common/MapHangoutsModal.jsx
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const fallbackCenter = {
  lat: 42.3314,
  lng: -83.0458,
};

const getPinIcon = (type) => {
  switch (type) {
    case "amigo": return "/assets/redalogo.png";
    case "grupo": return "/assets/g-logo.png";
    case "event": return "/assets/e-logo.png";
    default: return "/assets/redalogo.png";
  }
};

const MapHangoutsModal = ({ onClose }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState(fallbackCenter);
  const [grupos, setGrupos] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeInfo, setActiveInfo] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setMapCenter(fallbackCenter)
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [gruposSnap, amigosSnap, eventsSnap] = await Promise.all([
        getDocs(collection(db, "grupos")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "events")),
      ]);

      setGrupos(gruposSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setAmigos(amigosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setEvents(eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const handleInfoClick = (type, item) => {
    setActiveInfo({ type, item });
  };

  const handleInfoClose = () => {
    setActiveInfo(null);
  };

  const handleViewClick = () => {
    if (!activeInfo) return;
    if (activeInfo.type === "amigo") navigate(`/profile/${activeInfo.item.id}`);
    if (activeInfo.type === "grupo") navigate(`/grupos/${activeInfo.item.id}`);
    if (activeInfo.type === "event") navigate(`/events/${activeInfo.item.id}`);
  };

  const renderMarker = (type, item) => {
    if (!item.location || typeof item.location.lat !== 'number' || typeof item.location.lng !== 'number') {
      console.warn(`${type} missing or invalid location:`, item);
      return null;
    }

    return (
      <Marker
        key={`${type}-${item.id}`}
        position={item.location}
        title={`${type === "amigo" ? "Amigo" : type === "grupo" ? "Grupo" : "Event"}: ${
          item.displayName || item.name || item.title
        }`}
        icon={{
          url: getPinIcon(type),
          scaledSize: new window.google.maps.Size(36, 36),
        }}
        onClick={() => handleInfoClick(type, item)}
      />
    );
  };

  const modalOverlayClasses = "fixed inset-0 w-screen h-screen bg-black/60 z-[1000000] flex items-center justify-center font-comfortaa";
  const modalContainerClasses = "bg-white rounded-[1.25rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-[90%] max-w-xl relative";
  const closeModalButtonClasses = "absolute top-3 right-3 rounded-full bg-coral text-white font-comfortaa font-bold shadow-md p-2 text-lg hover:bg-coral-dark transition-all";
  const titleClasses = "text-center text-coral text-xl font-bold mb-4";
  const mapElementContainerClasses = "w-full h-[300px] rounded-lg";

  return (
    <div className={modalOverlayClasses}>
      <div className={modalContainerClasses}>
        <button onClick={onClose} className={closeModalButtonClasses}>✕</button>
        <h2 className={titleClasses}>Map Hangouts</h2>

        {isLoaded ? (
          <GoogleMap
            mapContainerClassName={mapElementContainerClasses}
            center={mapCenter}
            zoom={10}
          >
            {grupos.map((g) => renderMarker("grupo", g))}
            {amigos.map((a) => renderMarker("amigo", a))}
            {events.map((e) => renderMarker("event", e))}

            {activeInfo?.item?.location && (
              <InfoWindow
                position={activeInfo.item.location}
                onCloseClick={handleInfoClose}
              >
                <div className="text-sm p-2 font-comfortaa">
                  <p className="font-bold text-coral">
                    {activeInfo.item.displayName || activeInfo.item.name || activeInfo.item.title}
                  </p>
                  <button
                    onClick={handleViewClick}
                    className="mt-2 text-white bg-coral px-2 py-1 rounded hover:bg-coral-dark transition-colors"
                  >
                    View
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <p className="text-center text-gray-500">Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default MapHangoutsModal;
