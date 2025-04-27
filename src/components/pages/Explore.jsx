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
    <div className="explore-page">
      <h2>{t("suggestions")}</h2>
      {grupos.length > 0 ? (
        <ul>
          {grupos.map((grupo) => (
            <li key={grupo.id}>
              <strong>{grupo.name}</strong>: {grupo.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("noGrupos")}</p>
      )}
    </div>
  );
};

export default Explore;
