// src/components/pages/Grupos/GruposPage.jsx
import React, { useState } from 'react';
import CreateGrupo from './CreateGrupo';
import ExploreGrupos from './ExploreGrupos';
import YourGrupos from './YourGrupos';
import MapMeetups from './MapMeetups';
import { motion } from 'framer-motion'; // ✅ animations

const GruposPage = () => {
  const [tab, setTab] = useState('explore');

  const renderTab = () => {
    switch (tab) {
      case 'explore':
        return <ExploreGrupos />;
      case 'your':
        return <YourGrupos />;
      case 'create':
        return <CreateGrupo />;
      case 'map':
        return <MapMeetups />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center min-h-screen space-y-6 p-6 bg-gray-50"
    >
      <h1 className="text-4xl font-bold text-[#FF6B6B]">Grupos</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {[
          { id: 'explore', label: 'Explore' },
          { id: 'your', label: 'Your Grupos' },
          { id: 'create', label: 'Create' },
          { id: 'map', label: 'Map Meetups' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              tab === id
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl">{renderTab()}</div>
    </motion.div>
  );
};

export default GruposPage;
