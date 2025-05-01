// src/components/pages/Explore.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Explore = () => {
  const { t } = useTranslation();
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const gruposRef = collection(db, "grupos");
      const snapshot = await getDocs(gruposRef);
      const gruposList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGrupos(gruposList);
    };

    fetchGrupos();
  }, []);

  return (
    <div className="min-h-screen bg-[#FF6B6B] p-6 text-white font-[Comfortaa] flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">{t("suggestions")}</h2>

      {grupos.length > 0 ? (
        <ul className="w-full max-w-2xl space-y-4">
          {grupos.map((grupo) => (
            <li
              key={grupo.id}
              className="bg-white text-[#333] p-4 rounded-xl shadow-md"
            >
              <strong className="text-[#FF6B6B]">{grupo.name}</strong>
              <p className="text-sm mt-1">{grupo.description || "No description"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white text-lg">{t("noGrupos")}</p>
      )}
    </div>
  );
};

export default Explore;
