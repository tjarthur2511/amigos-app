// src/components/pages/Admin/AdminPanel.jsx
import React, { useState } from "react";
import { SeederScripts } from "../../../seeder/importMap";
import { motion } from "framer-motion"; // ✅ Animations for admin panel loading

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50"
    >
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-[#FF6B6B] mb-4 text-center">
          Admin Control Center
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Run Seeder Scripts and Admin Commands
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {scriptKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleScriptRun(key)}
              className="px-4 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#e15555] transition"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="w-full bg-gray-800 text-green-400 p-4 rounded-xl min-h-[120px] overflow-x-auto">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
