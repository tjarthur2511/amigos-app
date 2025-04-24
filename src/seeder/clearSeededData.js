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

      <button onClick={() => runSeeder('seedUsers')}>Seed Users</button>
      <button onClick={() => runSeeder('seedGrupos')}>Seed Grupos</button>
      <button onClick={() => runSeeder('seedEvents')}>Seed Events</button>
      <button onClick={() => runSeeder('seedQuestionSets')}>Seed Question Sets</button>
      <button onClick={() => runSeeder('clearSeededData')}>Clear Seeded Data</button>
    </div>
  );
};

export default AdminPanel;