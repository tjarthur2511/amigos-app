// src/components/pages/Grupos/YourGrupos.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const YourGrupos = () => {
  const [grupos, setGrupos] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const q = query(
          collection(db, "grupos"),
          where("creatorId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const grupoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGrupos(grupoList);
      } catch (error) {
        console.error("Error fetching your grupos:", error);
      }
    };

    fetchGrupos();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 p-6 bg-white rounded-2xl shadow-lg font-[Comfortaa]"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B] lowercase">
        {t("yourGrupos") || "your grupos"}
      </h2>

      {grupos.length === 0 ? (
        <p className="text-gray-600 lowercase">
          {t("noGrupos") || "you haven't created any grupos yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="border rounded-xl p-6 shadow-md bg-gray-50 hover:shadow-lg transition-all"
            >
              <h4 className="text-xl font-bold text-[#FF6B6B] mb-2 lowercase">
                {grupo.name}
              </h4>
              <p className="text-gray-700">
                {grupo.description || "no description provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default YourGrupos;
