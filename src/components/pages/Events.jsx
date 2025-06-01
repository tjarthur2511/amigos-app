import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase"; // Corrected path
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";

const EVENTS_PER_PAGE = 10;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false);
  const [lastVisibleEvent, setLastVisibleEvent] = useState(null);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [errorEventsList, setErrorEventsList] = useState(null);

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    grupoId: "",
    lat: "",
    lng: "",
  });

  const fetchInitialEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setErrorEventsList(null);
    setEvents([]);
    setLastVisibleEvent(null);
    setHasMoreEvents(true);

    try {
      const eventsQuery = query(
        collection(db, "events"),
        where("date", ">=", new Date()),
        orderBy("date", "asc"),
        limit(EVENTS_PER_PAGE)
      );
      const snapshot = await getDocs(eventsQuery);
      const eventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
      setLastVisibleEvent(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreEvents(eventList.length === EVENTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching initial events:", error);
      setErrorEventsList("Failed to load events. Please try again.");
      setEvents([]);
      setHasMoreEvents(false);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  const fetchMoreEvents = async () => {
    if (isLoadingMoreEvents || !hasMoreEvents || !lastVisibleEvent) return;

    setIsLoadingMoreEvents(true);
    setErrorEventsList(null);
    try {
      const eventsQuery = query(
        collection(db, "events"),
        where("date", ">=", new Date()),
        orderBy("date", "asc"),
        startAfter(lastVisibleEvent),
        limit(EVENTS_PER_PAGE)
      );
      const snapshot = await getDocs(eventsQuery);
      const newEventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents((prevEvents) => [...prevEvents, ...newEventList]);
      setLastVisibleEvent(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreEvents(newEventList.length === EVENTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching more events:", error);
      setErrorEventsList("Failed to load more events. Please try refreshing.");
    } finally {
      setIsLoadingMoreEvents(false);
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) {
      alert("Event name and date are required."); // Basic validation
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        ...newEvent,
        createdAt: serverTimestamp(),
        date: Timestamp.fromDate(new Date(newEvent.date)),
        lat: newEvent.lat ? parseFloat(newEvent.lat) : null, // Handle empty lat/lng
        lng: newEvent.lng ? parseFloat(newEvent.lng) : null,
        type: "event", // Consider if this field is still needed or should be dynamic
      });

      setNewEvent({ name: "", description: "", location: "", date: "", grupoId: "", lat: "", lng: "" });
      fetchInitialEvents(); // Refresh the list to show the new event
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again."); // User feedback
    }
  };

  useEffect(() => {
    fetchInitialEvents();
  }, [fetchInitialEvents]);

  return (
    // Changed bg-coral-light to bg-coral for a more vibrant page background as per original intent
    <div className="min-h-screen bg-coral text-white font-comfortaa p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-center">Create New Event</h2>

      <form
        onSubmit={handleCreateEvent}
        className="w-full max-w-xl bg-white text-charcoal-primary rounded-xl shadow-2xl p-8 space-y-6 mb-12"
      >
        {/* Matched input styling for consistency */}
        <input
          type="text"
          name="name"
          placeholder="Event Name (Required)"
          value={newEvent.name}
          onChange={handleInputChange}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow h-24 resize-none"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow"
        />
        <input
          type="datetime-local"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow"
        />
        <input
          type="text"
          name="grupoId"
          placeholder="Grupo ID (Optional)"
          value={newEvent.grupoId}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow"
        />
        <div className="flex gap-4">
            <input
            type="number"
            step="any"
            name="lat"
            placeholder="Latitude (Optional)"
            value={newEvent.lat}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow"
            />
            <input
            type="number"
            step="any"
            name="lng"
            placeholder="Longitude (Optional)"
            value={newEvent.lng}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none transition-shadow"
            />
        </div>
        <button
          type="submit"
          className="w-full bg-coral text-white font-semibold py-4 px-6 rounded-lg hover:bg-coral-dark focus:outline-none focus:ring-2 focus:ring-coral-dark focus:ring-opacity-50 transition-transform transform hover:scale-105 duration-150 ease-in-out"
        >
          Create Event
        </button>
      </form>

      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Upcoming Events</h2>
        {isLoadingEvents && <p className="text-center text-white py-4">Loading events...</p>}
        {errorEventsList && <p className="text-center text-yellow-300 bg-red-700 p-3 rounded-lg py-4">{errorEventsList}</p>}
        
        {!isLoadingEvents && !errorEventsList && events.length === 0 && (
          <p className="text-center text-white py-4 text-lg">
            No upcoming events found. Why not create one?
          </p>
        )}

        {events.length > 0 && (
          <ul className="space-y-6">
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-white text-charcoal-primary p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out"
              >
                <h3 className="text-2xl font-bold text-coral mb-2">{event.name}</h3>
                <p className="text-gray-700 mb-1 whitespace-pre-line">{event.description}</p>
                {event.location && <p className="text-sm text-gray-600 italic mt-2">Location: {event.location}</p>}
                <p className="text-sm text-gray-600 mt-2">
                  Date: {event.date?.toDate
                    ? event.date.toDate().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Date not specified'}
                </p>
              </li>
            ))}
          </ul>
        )}

        {hasMoreEvents && !isLoadingMoreEvents && events.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={fetchMoreEvents}
              className="bg-white text-coral font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
            >
              Load More Events
            </button>
          </div>
        )}
        {isLoadingMoreEvents && <p className="text-center text-white py-6">Loading more events...</p>}
        {!hasMoreEvents && events.length > 0 && !isLoadingEvents && (
          <p className="text-center text-gray-200 py-6 italic">You've reached the end of upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default Events;