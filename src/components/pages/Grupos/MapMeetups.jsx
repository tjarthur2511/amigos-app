import React from "react";

const MapMeetups = () => {
  return (
    <div className="flex flex-col items-center space-y-6 mt-6">
      <h2 className="text-4xl font-bold text-[#FF6B6B]">Map of Meetups</h2>

      <div className="w-full max-w-5xl h-[500px] border rounded-xl shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
        <iframe
          title="Meetup Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=42.3314,-83.0458&zoom=10"
        ></iframe>
      </div>
    </div>
  );
};

export default MapMeetups;
