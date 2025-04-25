// src/components/pages/Grupos/CreateGrupo.jsx
import React, { useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreateGrupo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "grupos"), {
        name,
        description,
        owner: auth.currentUser.uid,
        members: [auth.currentUser.uid],
        createdAt: serverTimestamp(),
      });
      setName("");
      setDescription("");
      alert("Grupo created!");
    } catch (error) {
      console.error("Error creating grupo:", error);
    }
  };

  return (
    <div className="create-grupo">
      <h2>Create a New Grupo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Group Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Grupo</button>
      </form>
    </div>
  );
};

export default CreateGrupo;
