// src/components/pages/Live/LivePage.jsx
import React, { useState } from "react";
import LiveFeed from "./LiveFeed";
import LiveSuggestions from "./LiveSuggestions";

const LivePage = () => {
  const [tab, setTab] = useState("feed");

  return (
    <div className="live-page container">
      <h1>Go Live</h1>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setTab("feed")} disabled={tab === "feed"}>Live Feed</button>
        <button onClick={() => setTab("suggested")} disabled={tab === "suggested"}>Suggestions</button>
      </div>

      {tab === "feed" && <LiveFeed />}
      {tab === "suggested" && <LiveSuggestions />}
    </div>
  );
};

export default LivePage;
