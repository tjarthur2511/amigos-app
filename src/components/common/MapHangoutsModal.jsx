import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const fallbackCenter = {
  lat: 42.3314,
  lng: -83.0458,
};

const getPinIcon = (type) => {
  switch (type) {
    case "amigo": return "/assets/amigosaonly_128.png";
    case "grupo": return "/assets/g-logo.png";
    case "event": return "/assets/e-logo.png";
    default: return "/assets/redalogo.png";
  }
};

const MapHangoutsModal = ({ onClose }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC635cp2x54I0JHITYia5Cy0j540BRKr2Q",
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

  const renderMarker = (type, item) => (
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Comfortaa, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.5rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          width: "90%",
          maxWidth: "600px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            fontSize: "1.2rem",
            color: "#FF6B6B",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "9999px",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#FF6B6B";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#FF6B6B";
          }}
        >
          ✕
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#FF6B6B",
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          Map Hangouts
        </h2>

        {isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
            {grupos.map((grupo) => renderMarker("grupo", grupo))}
            {amigos.map((amigo) => renderMarker("amigo", amigo))}
            {events.map((event) => renderMarker("event", event))}

            {activeInfo && activeInfo.item.location && (
              <InfoWindow
                position={activeInfo.item.location}
                onCloseClick={handleInfoClose}
              >
                <div className="text-sm p-2">
                  <p className="font-bold text-[#FF6B6B]">
                    {activeInfo.item.displayName || activeInfo.item.name || activeInfo.item.title}
                  </p>
                  <button
                    onClick={handleViewClick}
                    className="mt-2 text-white bg-[#FF6B6B] px-2 py-1 rounded hover:bg-red-500 transition"
                  >
                    View
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default MapHangoutsModal;
