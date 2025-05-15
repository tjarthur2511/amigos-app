// ✅ Final Explore.jsx with NavBar and MapHangoutsPage Layout
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import SuggestedAmigosCard from "../common/SuggestedAmigosCard";
import SuggestedGruposCard from "../common/SuggestedGruposCard";
import EventCard from "../common/EventCard";
import RSVPCard from "../common/RSVPCard";
import NavBar from "../NavBar";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import FallingAEffect from "../common/FallingAEffect";

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '1rem',
};

const center = {
  lat: 42.25,
  lng: -83.4,
};

const Explore = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("amigos");
  const [items, setItems] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (location?.state?.from === "grupos") setActiveTab("grupos");
    else if (location?.state?.from === "events") setActiveTab("events");
    else if (location?.state?.from === "rsvps") setActiveTab("rsvps");
    else if (location?.state?.from === "suggested") {
      const tabs = ["grupos", "events"];
      setActiveTab(tabs[Math.floor(Math.random() * tabs.length)]);
    } else setActiveTab("amigos");
  }, [location]);

  useEffect(() => {
    const fetchItems = async () => {
      let col = "users";
      if (activeTab === "grupos") col = "grupos";
      if (activeTab === "events") col = "events";
      if (activeTab === "rsvps") col = "rsvps";

      const ref = collection(db, col);
      const q = query(ref, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(list);

      if (col === "events") {
        setMapMarkers(list.filter(e => e.lat && e.lng));
      } else {
        setMapMarkers([]);
      }
    };
    fetchItems();
  }, [activeTab]);

  const renderCards = () => {
    return items.map((item) => {
      if (activeTab === "amigos") return <SuggestedAmigosCard key={item.id} amigo={item} />;
      if (activeTab === "grupos") return <SuggestedGruposCard key={item.id} grupo={item} />;
      if (activeTab === "events") return <EventCard key={item.id} event={item} />;
      if (activeTab === "rsvps") return <RSVPCard key={item.id} rsvp={item} />;
      return null;
    });
  };

  return (
    <div style={pageStyle}>
      <div style={bgEffect}><FallingAEffect /></div>

      {/* ✅ Persistent NavBar at top */}
      <NavBar />

      <header style={headerStyle}><h1 style={titleStyle}>explore</h1></header>

      <div style={mainCardWrapper}>
        <div style={mainCardStyle}>
          <div className="flex justify-center gap-4 mb-4">
            {["amigos", "grupos", "events", "rsvps"].map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={key === activeTab ? activeTabStyle : tabStyle}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {isLoaded && mapMarkers.length > 0 && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            >
              {mapMarkers.map((marker) => (
                <Marker key={marker.id} position={{ lat: marker.lat, lng: marker.lng }} />
              ))}
            </GoogleMap>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            {items.length === 0 ? (
              <p style={comingSoonText}>{t("noResults")}</p>
            ) : (
              renderCards()
            )}
          </div>
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

const tabStyle = {
  backgroundColor: '#ff9999',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontFamily: 'Comfortaa, sans-serif'
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: 'white',
  color: '#FF6B6B',
  fontWeight: 'bold'
};

const comingSoonText = {
  fontSize: '1.2rem',
  color: '#FF6B6B'
};

export default Explore;
