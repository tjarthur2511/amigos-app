// src/components/pages/Admin/AdminPanel.jsx
import React, { useState } from "react";
import { SeederScripts } from "../../../seeder/importMap";

const AdminPanel = () => {
  const [output, setOutput] = useState("");

  const handleScriptRun = async (scriptName) => {
    const scriptFn = SeederScripts[scriptName];
    if (!scriptFn) {
      setOutput(`❌ Script "${scriptName}" not found.`);
      return;
    }

    try {
      await scriptFn();
      setOutput(`✅ Successfully ran: ${scriptName}`);
    } catch (err) {
      setOutput(`❌ Error running "${scriptName}": ${err.message}`);
    }
  };

  const scriptKeys = Object.keys(SeederScripts);

  return (
    <div className="admin-panel container">
      <h1>Admin Control Center</h1>
      <p>Run Seeder Scripts:</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {scriptKeys.map((key) => (
          <button key={key} onClick={() => handleScriptRun(key)}>
            {key}
          </button>
        ))}
      </div>
      <pre style={{ marginTop: "20px", background: "#222", color: "#fff", padding: "10px" }}>
        {output}
      </pre>
    </div>
  );
};

export default AdminPanel;
