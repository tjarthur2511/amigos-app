import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const YourGrupos = () => {
  const [yourGrupos, setYourGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrupos = async () => {
      setLoading(true);
      setError("");
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("User not authenticated");

        const q = query(
          collection(db, "grupos"),
          where("members", "array-contains", uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setYourGrupos(data);
      } catch (err) {
        console.error("Error fetching user's grupos:", err);
        setError("Unable to load your grupos.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-[#FF6B6B]">Your Grupos</h2>

      {loading ? (
        <p className="text-gray-500">Loading your grupos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : yourGrupos.length === 0 ? (
        <p className="text-gray-600">You haven't joined or created any grupos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {yourGrupos.map((grupo) => (
            <Link
              key={grupo.id}
              to={`/grupos/${grupo.id}`}
              className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-all flex flex-col space-y-2"
            >
              <h3 className="text-2xl font-bold text-[#FF6B6B]">{grupo.name}</h3>
              <p className="text-gray-700">{grupo.description || "No description provided."}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourGrupos;
