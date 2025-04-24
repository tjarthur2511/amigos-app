// src/components/pages/Grupos/CreateGrupo.js
import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreateGrupo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "grupos"), {
        name: name.trim(),
        description: description.trim(),
        owner: auth.currentUser?.uid || "unknown",
        members: [auth.currentUser?.uid || "unknown"],
        createdAt: serverTimestamp(),
      });
      setName("");
      setDescription("");
      setSuccess(true);
    } catch (err) {
      console.error("Error creating grupo:", err);
      setError("Failed to create grupo. Please try again.");
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Grupo"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>✅ Grupo created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateGrupo;
