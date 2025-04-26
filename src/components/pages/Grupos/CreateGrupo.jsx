import React, { useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreateGrupo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "grupos"), {
        name,
        description,
        creatorId: auth.currentUser.uid,
        members: [auth.currentUser.uid],
        createdAt: serverTimestamp(),
        isPrivate: false,
        isAgeRestricted: false,
      });
      setName("");
      setDescription("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating grupo:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 mt-6">
      <h2 className="text-4xl font-bold text-[#FF6B6B]">Create a New Grupo</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex flex-col space-y-4 bg-white p-6 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
        />
        <textarea
          placeholder="Group Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
        />

        <button
          type="submit"
          className="bg-[#FF6B6B] text-white py-3 rounded-lg font-semibold hover:bg-[#ff8585] transition-all"
        >
          Create Grupo
        </button>

        {success && (
          <p className="text-green-500 text-center font-bold">
            🎉 Grupo created successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateGrupo;
