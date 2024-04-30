import React, { useState, useEffect, useCallback } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getLocationDetails, getNearbyPlaces, pingProxy } from "../../services/tripadvisorService.js";
import { savePlaceDetails } from '../../services/saveService.js';
import { deleteAllPlaceDetails } from '../../services/placeService.js';
import poi_marker from '../../assets/poi-marker.png'
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
 const [nearbyPlaceDetails, setNearbyPlaceDetails] = useState([]);
 const [selectedPlace, setSelectedPlace] = useState(null);

 const handleDblClick = useCallback(
    async (e) => {
      setNewPlace([e.lngLat.lat, e.lngLat.lng]);
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

 const handleMarkerClick = (place) => {
    setSelectedPlace(place);
 };

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
      {nearbyPlaceDetails.map((place, index) => (
        <Marker
          key={index}
          latitude={place.latitude}
          longitude={place.longitude}
          offsetLeft={-20}
          offsetTop={-10}
          onClick={() => handleMarkerClick(place)}
        >
          <div style={{ 
            width: '40px', 
            height: '60px', 
            backgroundImage: `url(${poi_marker})`, 
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat',
          }} />
        </Marker>
      ))}
      {selectedPlace && (
        <Popup
          latitude={selectedPlace.latitude}
          longitude={selectedPlace.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setSelectedPlace(null)}
          anchor="top"
        >
          <div>
            <h3>{selectedPlace.name}</h3>
            {selectedPlace.rating_image_url && (
              <img src={selectedPlace.rating_image_url} alt="Rating" />
            )}
          </div>
        </Popup>
      )}
    </MapGL>
 );
};
