import React, { useState } from 'react';
import CreateGrupo from './CreateGrupo';
import ExploreGrupos from './ExploreGrupos';
import YourGrupos from './YourGrupos';
import MapMeetups from './MapMeetups';

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
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-4xl font-bold text-[#FF6B6B]">Grupos</h1>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setTab('explore')}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            tab === 'explore'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setTab('your')}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            tab === 'your'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
        >
          Your Grupos
        </button>
        <button
          onClick={() => setTab('create')}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            tab === 'create'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
        >
          Create
        </button>
        <button
          onClick={() => setTab('map')}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            tab === 'map'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
        >
          Map Meetups
        </button>
      </div>

      <div className="w-full px-4">{renderTab()}</div>
    </div>
  );
};

export default GruposPage;
