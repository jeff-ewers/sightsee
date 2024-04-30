// Map.jsx
import React, { useState, useEffect, useCallback } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker } from 'react-map-gl';
import { getLocationDetails, getNearbyPlaces, pingProxy } from "../../services/tripadvisorService.js";
import { savePlaceDetails } from '../../services/saveService.js';
import { deleteAllPlaceDetails } from '../../services/placeService.js';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 48.858093,
    longitude: 2.299694,
    width: "100vw",
    height: "100vh",
    pitch: 67,
    zoom: 15
  });
  const [newPlace, setNewPlace] = useState(null);
  const [nearbyPlaceDetails, setNearbyPlaceDetails] = useState({});



  const handleDblClick = useCallback(
    async (e) => {
      setNewPlace([e.lngLat.lat, e.lngLat.lng]);
      // pingProxy();
      const deleteRes = await deleteAllPlaceDetails();
      const nearbyPlaces = await getNearbyPlaces(e.lngLat.lat, e.lngLat.lng);
      const nearbyDetails = [];
      for (const nearbyPlace of nearbyPlaces.data) {
        let details = await getLocationDetails(nearbyPlace.location_id);
        nearbyDetails.push(details);
        savePlaceDetails(details);
      }
      setNearbyPlaceDetails(nearbyDetails);


      
    },
    []
  );

  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
    return newViewport;
  }, []);
  
  // useEffect(() => {
  //   const { latitude, longitude } = viewport;
  //   const fetchNearbyPlaces = async () => {
  //     const nearbyPlaces = await getNearbyPlaces(latitude, longitude);
  //     for (const nearbyPlace of nearbyPlaces.data) {
  //       console.log(nearbyPlace.location_id);
  //     }
  //   };
  //   fetchNearbyPlaces();
  // }, [viewport]);
  
  // ...
  
  return (
    <MapGL
      initialViewState={viewport}
      mapboxAccessToken={TOKEN}
      mapStyle="mapbox://styles/sightsee-admin/clv65kdd702s401pk1yu1dsi8/draft"
      transitionDuration="200"
      onViewportChange={handleViewportChange}
      onDblClick={handleDblClick}
      doubleClickZoom={false}
    >
      {/* ... */}
    </MapGL>
  );
};


