// src/components/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import NavBar from "../common/NavBar";
import MapToggleView from "../common/MapToggleView";
import SuggestedAmigosCard from "../common/SuggestedAmigosCard";
import SuggestedGruposCard from "../common/SuggestedGruposCard";
import EventCard from "../common/EventCard";
import RSVPCard from "../common/RSVPCard";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

const Explore = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("amigos");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (location?.state?.from === "grupos") setActiveTab("grupos");
    else if (location?.state?.from === "events") setActiveTab("events");
    else if (location?.state?.from === "rsvps") setActiveTab("rsvps");
    else setActiveTab("amigos");
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
    };
    fetchItems();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FF6B6B] text-white font-[Comfortaa]">
      <NavBar />

      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("Explore")}</h1>
        <div className="flex justify-center gap-4 mb-4">
          {[
            { label: "Amigos", key: "amigos" },
            { label: "Grupos", key: "grupos" },
            { label: "Events", key: "events" },
            { label: "RSVPs", key: "rsvps" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab.key ? "bg-white text-[#FF6B6B] font-bold" : "bg-[#ff9999]"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <MapToggleView type={activeTab} />

      <div className="p-4 flex flex-col gap-4 max-w-3xl mx-auto">
        {items.length === 0 ? (
          <p className="text-center text-white">{t("noResults")}</p>
        ) : (
          items.map((item) => {
            if (activeTab === "amigos") return <SuggestedAmigosCard key={item.id} amigo={item} />;
            if (activeTab === "grupos") return <SuggestedGruposCard key={item.id} grupo={item} />;
            if (activeTab === "events") return <EventCard key={item.id} event={item} />;
            if (activeTab === "rsvps") return <RSVPCard key={item.id} rsvp={item} />;
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default Explore;
