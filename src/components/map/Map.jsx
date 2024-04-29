// Map.jsx
import React, { useState, useEffect, useCallback } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker } from 'react-map-gl';
import { getNearbyPlaces } from "../../services/tripadvisorService.js";

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

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleDblClick = useCallback(
    async (e) => {
      setNewPlace([e.lngLat.lat, e.lngLat.lng]);
      const nearbyPlaces = await getNearbyPlaces(e.lngLat.lat, e.lngLat.lng);
      console.log(nearbyPlaces);
    },
    []
  );

  return (
    <MapGL
      initialViewState={viewport}
      mapboxAccessToken={TOKEN}
      mapStyle="mapbox://styles/sightsee-admin/clv65kdd702s401pk1yu1dsi8/draft"
      transitionDuration="200"
      onViewportChange={handleViewportChange}
      onDblClick={handleDblClick}
    >
      {newPlace ? (
        <Marker
          latitude={newPlace[0]}
          longitude={newPlace[1]}
          offsetLeft={-3.5 * viewport.zoom}
          offsetTop={-3.5 * viewport.zoom}
        />
      ) : null}
    </MapGL>
  );
};



// import "mapbox-gl/dist/mapbox-gl.css"
// import { useState, useRef, useEffect } from 'react'
// import mapboxgl from "mapbox-gl"
// import './Map.css'
// import Map from 'react-map-gl'
// import { Marker } from "react-map-gl"

// export const Map = () => {
    

//       const mapContainer = useRef(null);
//       const map = useRef(null);
//       const [lng, setLng] = useState(-70.9);
//       const [lat, setLat] = useState(42.35);
//       const [zoom, setZoom] = useState(9);
      
    
//       useEffect(() => {
//         if (map.current) return; // initialize map only once
//         map.current = new mapboxgl.Map({
//           container: mapContainer.current,
//           style: 'mapbox://styles/mapbox/streets-v12',
//           center: [lng, lat],
//           zoom: zoom
//         });
    
//         map.current.on('move', () => {
//           setLng(map.current.getCenter().lng.toFixed(4));
//           setLat(map.current.getCenter().lat.toFixed(4));
//           setZoom(map.current.getZoom().toFixed(2));
//         });
//       });
    
//       return (
//         <div>
//           <div className="sidebar">
//             Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
//           </div>
//           <div ref={mapContainer} className="map-container" />
//         </div>
//       );
//     }