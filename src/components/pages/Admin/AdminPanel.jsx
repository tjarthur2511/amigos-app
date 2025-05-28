import React, { useState } from "react";
import { SeederScripts } from "../../../seeder/importMap";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [output, setOutput] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const allowedUids = ["user123", "tjarthur2511@gmail.com"];
  const uid = currentUser?.uid;
  const email = currentUser?.email;
  const isAdmin = allowedUids.includes(uid) || allowedUids.includes(email);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center text-red-600 font-comfortaa"> {/* Used font-comfortaa */}
        <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  const handleScriptRun = async (scriptName) => {
    const scriptFn = SeederScripts[scriptName];
    if (!scriptFn) {
      setOutput(`❌ Script "${scriptName}" not found.`);
      return;
    }

    try {
      const result = await scriptFn(); // ✅ captures return string
      setOutput(result || `✅ Successfully ran: ${scriptName}`);
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
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 font-comfortaa" // Added font-comfortaa
    >
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-coral mb-4 text-center"> {/* Used text-coral */}
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
              className="px-4 py-3 bg-coral text-white rounded-xl hover:bg-coral-dark transition" // Used bg-coral and hover:bg-coral-dark
            >
              {key}
            </button>
          ))}
        </div>

        <div className="w-full bg-gray-800 text-green-400 p-4 rounded-xl min-h-[120px] overflow-x-auto">
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>

        <div className="mt-6 text-center space-y-4">
          <button
            onClick={() => navigate("/test-firestore-write")}
            className="bg-black text-white px-6 py-2 rounded-full shadow hover:shadow-lg"
          >
            🔥 Run Firestore Test Tool
          </button>

          <button
            onClick={() => navigate("/test-storage-upload")}
            className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:shadow-lg"
          >
            📦 Run Storage Upload Test
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
