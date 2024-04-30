import React, { useState, useEffect, useCallback } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getLocationDetails, getNearbyPlaces, getNearbyPlacesByCategory, pingProxy } from "../../services/tripadvisorService.js";
import { savePlaceDetails } from '../../services/saveService.js';
import { deleteAllPlaceDetails } from '../../services/placeService.js';
import poi_marker from '../../assets/poi-marker.png'
import { CategorySelect } from './CategorySelect.jsx';
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = () => {
 const [viewport, setViewport] = useState({
    latitude: 48.85447,
    longitude: 2.302967,
    width: "100vw",
    height: "100vh",
    pitch: 67,
    zoom: 16
 });
 const [newPlace, setNewPlace] = useState(null);
 const [nearbyPlaceDetails, setNearbyPlaceDetails] = useState([]);
 const [selectedPlace, setSelectedPlace] = useState(null);
 const [placeCategory, setPlaceCategory] = useState('hotels');

 const handleDblClick = useCallback(
    async (e) => {
      console.time("nearby places")
      setNewPlace([e.lngLat.lat, e.lngLat.lng]);
      console.log("clearing place details")
      const deleteRes = await deleteAllPlaceDetails();
      console.timeLog("nearby places")
      console.log("fetching nearby places")
      const nearbyPlaces = await getNearbyPlacesByCategory(e.lngLat.lat, e.lngLat.lng, placeCategory);
      console.timeLog("nearby places")
      const nearbyDetails = [];
      for (const nearbyPlace of nearbyPlaces.data) {
        console.log("fetching nearby place details")
        let details = await getLocationDetails(nearbyPlace.location_id);
        console.timeLog("nearby places")
        nearbyDetails.push(details);
        console.log("caching place details")
        savePlaceDetails(details);
        console.timeLog("nearby places")
      }
      console.log("setting state")
      setNearbyPlaceDetails(nearbyDetails);
      console.timeLog("nearby places")
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
  <>
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
        style={{ maxWidth: '200px' }} // Set the maximum width of the popup
     >
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: 'var(--primary)' }}>{selectedPlace.name}</h3>
          {selectedPlace.description && (
            <p style={{ fontSize: '0.8em', marginTop: '5px', color: 'var(--dark)' }}>
              {selectedPlace.description.length > 100 ? 
            `${selectedPlace.description.substring(0, 100)}...` : 
            selectedPlace.description}</p>
          )}
          {selectedPlace.rating_image_url && (
            <img src={selectedPlace.rating_image_url} alt="Rating" style={{ width: '100%', marginTop: '10px', marginLeft: '-13px' }} />
          )}
        </div>
        </Popup>
      )}
    </MapGL>
    <CategorySelect placeCategory={placeCategory} setPlaceCategory={setPlaceCategory} />
    </>
 );
};
