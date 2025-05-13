// src/components/pages/Admin/TestStorageUpload.jsx
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../../firebase";
import { auth } from "../../../firebase";

const TestStorageUpload = () => {
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);

  const handleUpload = async () => {
    const user = auth.currentUser;
    if (!user || (user.uid !== "user123" && user.email !== "tjarthur2511@gmail.com")) {
      setStatus("❌ Unauthorized");
      return;
    }

    if (!file) {
      setStatus("⚠️ Please select a file first");
      return;
    }

    const fileRef = ref(storage, `test_uploads/${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      setUrl(downloadURL);
      setStatus("✅ File uploaded successfully");
    } catch (err) {
      setStatus("❌ Upload failed: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!file) return;
    const fileRef = ref(storage, `test_uploads/${file.name}`);
    try {
      await deleteObject(fileRef);
      setStatus("🗑️ File deleted from storage");
      setUrl(null);
    } catch (err) {
      setStatus("❌ Delete failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-[Comfortaa] p-8">
      <h1 className="text-3xl font-bold text-[#FF6B6B] mb-6">Test Storage Upload</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <div className="space-x-4 mb-4">
        <button
          onClick={handleUpload}
          className="bg-[#FF6B6B] text-white px-4 py-2 rounded-full"
        >
          📤 Upload File
        </button>

        <button
          onClick={handleDelete}
          className="bg-gray-300 text-black px-4 py-2 rounded-full"
        >
          🗑️ Delete File
        </button>
      </div>

      {url && (
        <div className="mb-4">
          <p className="text-green-600">File URL:</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {url}
          </a>
        </div>
      )}

      <pre className="mt-6 p-4 bg-white rounded-xl shadow text-sm text-green-700 whitespace-pre-wrap">
        {status || "Upload status will appear here..."}
      </pre>
    </div>
  );
};

export default TestStorageUpload;
