// src/components/pages/Grupos/GruposPage.jsx
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
    <div className="container">
      <h1>Grupos</h1>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setTab('explore')} disabled={tab === 'explore'}>Explore</button>
        <button onClick={() => setTab('your')} disabled={tab === 'your'}>Your Grupos</button>
        <button onClick={() => setTab('create')} disabled={tab === 'create'}>Create</button>
        <button onClick={() => setTab('map')} disabled={tab === 'map'}>Map Meetups</button>
      </div>
      {renderTab()}
    </div>
  );
};

export default GruposPage;
