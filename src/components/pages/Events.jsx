import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    grupoId: "",
    lat: "",
    lng: "",
  });

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const eventList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(eventList);
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) return;

    await addDoc(collection(db, "events"), {
      ...newEvent,
      createdAt: serverTimestamp(),
      date: Timestamp.fromDate(new Date(newEvent.date)),
      lat: parseFloat(newEvent.lat),
      lng: parseFloat(newEvent.lng),
      type: "event",
    });

    setNewEvent({ name: "", description: "", location: "", date: "", grupoId: "", lat: "", lng: "" });
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#FF6B6B] text-white font-[Comfortaa] p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Create New Event</h2>

      <form
        onSubmit={handleCreateEvent}
        className="w-full max-w-xl bg-white text-[#333] rounded-xl shadow-md p-6 space-y-4 mb-10"
      >
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#FF6B6B] outline-none transition"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="datetime-local"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="text"
          name="grupoId"
          placeholder="Grupo ID (optional)"
          value={newEvent.grupoId}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="text"
          name="lat"
          placeholder="Latitude"
          value={newEvent.lat}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="text"
          name="lng"
          placeholder="Longitude"
          value={newEvent.lng}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <button
          type="submit"
          className="w-full bg-[#FF6B6B] text-white py-3 rounded-xl hover:bg-[#e15555] transition"
        >
          Create Event
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>

      <ul className="w-full max-w-3xl space-y-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="bg-white text-[#333] p-5 rounded-xl shadow-md"
          >
            <h3 className="text-xl font-bold text-[#FF6B6B]">{event.name}</h3>
            <p className="text-sm">{event.description}</p>
            <p className="text-sm italic mt-1">{event.location}</p>
            <p className="text-sm mt-1">
              {event.date?.toDate
                ? event.date.toDate().toLocaleString()
                : event.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;