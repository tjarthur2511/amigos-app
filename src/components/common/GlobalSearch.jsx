// src/components/common/GlobalSearch.jsx
import React, { useState } from "react";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Search for: ${query}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center bg-white rounded-full shadow-md px-4 py-2 w-[280px]"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search amigos, grupos..."
        className="w-full bg-[#fef2f2] rounded-full px-3 py-1 outline-none text-[#FF6B6B] font-[Comfortaa] placeholder-gray-400"
      />
    </form>
  );
};

export default GlobalSearch;
