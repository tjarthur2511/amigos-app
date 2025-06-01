// src/components/pages/MapHangouts/MapHangoutsPage.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import FallingAEffect from '../../common/FallingAEffect'; // Corrected path assuming common components folder
import { useNavigate } from 'react-router-dom'; // For InfoWindow link

const DETROIT_CENTER = { lat: 42.3314, lng: -83.0458 };
const MAP_ZOOM_DEFAULT = 12;
const EVENTS_QUERY_LIMIT = 50; // Max events to fetch per bounds change

const MapHangoutsPage = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // example library, if needed in future
  });

  const [mapEvents, setMapEvents] = useState([]);
  const [mapCenter, setMapCenter] = useState(DETROIT_CENTER);
  const [isLoading, setIsLoading] = useState(true); // For events and initial location
  const [error, setError] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [activeMarkerItem, setActiveMarkerItem] = useState(null);

  const mapRef = useRef(null);
  const navigate = useNavigate();

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false); // Location found, initial loading done for center
        },
        () => {
          // Error or permission denied
          setMapCenter(DETROIT_CENTER); // Fallback to default
          setIsLoading(false); // Fallback, initial loading done for center
          console.warn("User location access denied or failed, defaulting to Detroit.");
        }
      );
    } else {
      // Geolocation not supported
      setMapCenter(DETROIT_CENTER);
      setIsLoading(false); // No geolocation, initial loading done for center
      console.warn("Geolocation not supported by this browser, defaulting to Detroit.");
    }
  }, []);

  const fetchEventsInBounds = useCallback(async (bounds) => {
    if (!bounds) return;
    setIsLoading(true);
    setError(null);

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    try {
      // Simplified geoquery. For production, consider Geohashes (e.g., with geofire-common).
      // This query fetches events within the rectangular bounds.
      // Firestore limitations:
      // - Cannot do direct distance-based queries.
      // - Range queries on multiple fields (lat & lng) can be tricky and might require composite indexes.
      // - Longitude wrapping (180th meridian) is not handled.

      // Placeholder comment for Geohash integration:
      // If events had a 'geohash' field:
      // const centerHash = geohashForLocation([mapCenter.lat, mapCenter.lng]);
      // const queryBounds = geohashQueryBounds([mapCenter.lat, mapCenter.lng], radiusInM); // radius based on zoom
      // const promises = queryBounds.map(b => {
      //   return getDocs(query(collection(db, 'events'), orderBy('geohash'), startAt(b[0]), endAt(b[1])));
      // });
      // const snapshots = await Promise.all(promises); ... process snapshots ...

      const eventsQuery = query(
        collection(db, 'events'),
        where('lat', '>=', sw.lat()),
        where('lat', '<=', ne.lat()),
        // orderBy('lat'), // Might be needed for some composite queries, or orderBy('geohash') if using geohashes
        // orderBy('date', 'desc'), // Example: order by date if desired, might need composite index
        limit(EVENTS_QUERY_LIMIT)
      );

      const snapshot = await getDocs(eventsQuery);
      let eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client-side filter for longitude since Firestore can't do two range filters effectively without geohashes
      // or specific indexing strategies. This is a fallback.
      eventList = eventList.filter(event => event.lng >= sw.lng() && event.lng <= ne.lng());

      setMapEvents(eventList);
    } catch (err) {
      console.error("Error fetching events in bounds:", err);
      setError("Failed to load hangouts in this area. Please try moving the map.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mapBounds) {
      fetchEventsInBounds(mapBounds);
    }
  }, [mapBounds, fetchEventsInBounds]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    // Optionally set initial bounds after map loads with a center
    // const initialBounds = map.getBounds();
    // if (initialBounds) setMapBounds(initialBounds);
  }, []);

  const onMapIdle = useCallback(() => {
    if (mapRef.current) {
      const newBounds = mapRef.current.getBounds();
      if (newBounds && (!mapBounds || !newBounds.equals(mapBounds))) {
         // Check if bounds actually changed to avoid redundant fetches
        setMapBounds(newBounds);
      }
    }
  }, [mapBounds]);


  const getPinIcon = (type = 'event') => { // Default to event icon
    switch (type) {
      case 'amigo': return '/assets/amigosaonly.png'; // Kept for reference
      case 'grupo': return '/assets/g-logo.png';     // Kept for reference
      case 'event': return '/assets/e-logo.png';
      default: return '/assets/e-logo.png'; // Default to event
    }
  };

  if (loadError) return <div className="font-comfortaa text-center p-8 text-red-700">Error loading Google Maps. Please check your API key and internet connection.</div>;
  // Initial loading for map API OR for user location
  if (!isLoaded || (isLoading && mapCenter === DETROIT_CENTER && !navigator.geolocation)) {
    return (
      <div className="font-comfortaa bg-coral min-h-screen flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 z-0"><FallingAEffect /></div>
        <p className="text-2xl z-10">Loading Map & Hangouts...</p>
      </div>
    );
  }

  return (
    <div className="font-comfortaa bg-coral min-h-screen overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none"><FallingAEffect /></div>

      <header className="text-center pt-8 pb-4 z-10 relative">
        <h1 className="text-5xl text-white font-bold">Map Hangouts</h1>
      </header>

      <div className="flex justify-center mb-8 z-10 relative">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-11/12 max-w-4xl text-center">
          <h2 className="text-3xl text-coral font-semibold mb-6">Hangouts Near You</h2>

          {isLoading && <p className="text-lg text-coral-dark py-2">Loading hangouts in area...</p>}
          {error && <p className="text-lg text-red-500 bg-red-100 p-3 rounded-md py-2">{error}</p>}

          <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg mx-auto my-4">
            <GoogleMap
              mapContainerClassName="w-full h-full" // Use className for map container
              center={mapCenter}
              zoom={MAP_ZOOM_DEFAULT}
              onLoad={onMapLoad}
              onIdle={onMapIdle}
              options={{ gestureHandling: 'greedy',ถนนdisableDefaultUI: true, zoomControl: true }}
            >
              {mapEvents.map((event) => (
                <Marker
                  key={event.id}
                  position={{ lat: event.lat, lng: event.lng }}
                  icon={{
                    url: getPinIcon('event'), // Assuming all are events for now
                    scaledSize: new window.google.maps.Size(32, 32),
                  }}
                  title={event.name || 'Event'}
                  onClick={() => setActiveMarkerItem(event)}
                />
              ))}

              {activeMarkerItem && (
                <InfoWindow
                  position={{ lat: activeMarkerItem.lat, lng: activeMarkerItem.lng }}
                  onCloseClick={() => setActiveMarkerItem(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                  <div className="p-2 font-comfortaa text-charcoal-primary max-w-xs">
                    <h4 className="text-lg font-bold text-coral mb-1">{activeMarkerItem.name}</h4>
                    <p className="text-sm mb-1">{activeMarkerItem.description?.substring(0,100)}{activeMarkerItem.description?.length > 100 ? '...' : ''}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Date: {activeMarkerItem.date?.toDate ? activeMarkerItem.date.toDate().toLocaleDateString() : 'N/A'}
                    </p>
                    <button
                      onClick={() => navigate(`/events/${activeMarkerItem.id}`)} // Assuming event details page route
                      className="bg-coral text-white text-xs px-3 py-1 rounded-md hover:bg-coral-dark transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
           {!isLoading && mapEvents.length === 0 && !error && (
            <p className="text-gray-500 mt-4">No hangouts found in this map area. Try panning or zooming out.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapHangoutsPage;
