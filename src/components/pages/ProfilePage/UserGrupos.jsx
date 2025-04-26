// src/components/pages/ProfilePage/UserGrupos.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // ✅ smooth animation

const UserGrupos = () => {
  const { t } = useTranslation();
  const [grupos, setGrupos] = useState([]);

  const fetchUserGrupos = async () => {
    try {
      const q = query(collection(db, "grupos"), where("creatorId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedGrupos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGrupos(fetchedGrupos);
    } catch (error) {
      console.error("Error fetching grupos:", error);
    }
  };

  useEffect(() => {
    fetchUserGrupos();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 p-6 bg-gray-50 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B]">
        {t("yourGrupos") || "Your Grupos"}
      </h2>

      {grupos.length === 0 ? (
        <p className="text-gray-600">{t("noGrupos") || "You haven't created any grupos yet."}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-all"
            >
              <h4 className="text-xl font-bold text-[#FF6B6B]">{grupo.name}</h4>
              <p className="text-gray-700 mt-2">{grupo.description || "No description provided."}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UserGrupos;
