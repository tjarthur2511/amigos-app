import React from "react";

const AdminPanel = () => {
  const runSeeder = async (script) => {
    try {
      const module = await import(`../../seeder/${script}.js`);
      if (typeof module.default === 'function') {
        await module.default();
      } else if (typeof module[script] === 'function') {
        await module[script]();
      }
      alert(`${script} ran successfully ✅`);
    } catch (error) {
      console.error(`Error running ${script}:`, error);
      alert(`❌ Failed to run ${script}`);
    }
  };

  return (
    <div className="admin-panel container">
      <h2>Admin Panel</h2>
      <p>Welcome, admin. Use the buttons below to manage data.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <h3>🌱 Seed Data</h3>
        <button onClick={() => runSeeder('seedAll')}>Seed All</button>
        <button onClick={() => runSeeder('seedUsers')}>Seed Users</button>
        <button onClick={() => runSeeder('seedGrupos')}>Seed Grupos</button>
        <button onClick={() => runSeeder('seedEvents')}>Seed Events</button>
        <button onClick={() => runSeeder('seedReactions')}>Seed Reactions</button>
        <button onClick={() => runSeeder('seedQuestionSets')}>Seed Question Sets</button>

        <h3>🧹 Clear Data</h3>
        <button onClick={() => runSeeder('clearAll')}>Clear All</button>
        <button onClick={() => runSeeder('clearUsers')}>Clear Users</button>
        <button onClick={() => runSeeder('clearGrupos')}>Clear Grupos</button>
        <button onClick={() => runSeeder('clearEvents')}>Clear Events</button>
        <button onClick={() => runSeeder('clearReactions')}>Clear Reactions</button>
        <button onClick={() => runSeeder('clearQuestionSets')}>Clear Question Sets</button>
        <button onClick={() => runSeeder('clearWeeklyQuestion')}>Clear Weekly Question</button>
      </div>
    </div>
  );
};

export default AdminPanel;