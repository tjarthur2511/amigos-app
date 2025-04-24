import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const YourGrupos = () => {
  const [grupos, setGrupos] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGrupos = async () => {
      const q = query(
        collection(db, "grupos"),
        where("createdBy", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const grupoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGrupos(grupoList);
    };

    fetchGrupos();
  }, []);

  return (
    <div className="your-grupos">
      <h2>{t("yourGrupos")}</h2>
      {grupos.length === 0 ? (
        <p>{t("noGrupos")}</p>
      ) : (
        grupos.map((grupo) => (
          <div key={grupo.id} className="grupo">
            <h4>{grupo.name}</h4>
            <p>{grupo.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default YourGrupos;
