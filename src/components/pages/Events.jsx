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
    });

    setNewEvent({ name: "", description: "", location: "", date: "" });
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <h2>Create New Event</h2>
      <form onSubmit={handleCreateEvent}>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
        />
        <button type="submit">Create</button>
      </form>

      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.name}</strong>
            <p>{event.description}</p>
            <p>{event.location}</p>
            <p>
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
