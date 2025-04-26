import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

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
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-[#FF6B6B]">{t("yourGrupos") || "Your Grupos"}</h2>

      {grupos.length === 0 ? (
        <p className="text-gray-600">{t("noGrupos") || "You haven't created any grupos yet."}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition-all"
            >
              <h4 className="text-xl font-bold text-[#FF6B6B]">{grupo.name}</h4>
              <p className="text-gray-700 mt-2">{grupo.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourGrupos;
