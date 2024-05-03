import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getLocationDetails, getNearbyPlaces, getNearbyPlacesByCategory } from "../../services/tripadvisorService.js";
import { savePlaceDetails, saveTripAdvisorPlaceToSelectedTrip } from '../../services/saveService.js';
import { deleteAllPlaceDetails } from '../../services/placeService.js';
import poi_marker from '../../assets/poi-marker.png'
import { CategorySelect } from './CategorySelect.jsx';
import { maxBy, minBy } from 'lodash'
import { TripSelector } from './TripSelector.jsx';
import plus_button from '../../assets/plus_button_box_round-512.png'
import './Map.css'
import { getTripsWithPlaces } from '../../services/tripService.js';
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = ({trips, setTrips, currentUser, setUpdateTrips}) => {


 const mapRef = useRef();
 const [viewport, setViewport] = useState({
    latitude: 48.85447,
    longitude: 2.302967,
    width: "100vw",
    height: "100vh",
    pitch: 67,
    zoom: 16
 });
 const navigate = useNavigate();
 const [nearbyPlaceDetails, setNearbyPlaceDetails] = useState([]);
 const [selectedPlace, setSelectedPlace] = useState(null);
 const [placeCategory, setPlaceCategory] = useState('1');
 const placeCategoryRef = useRef(placeCategory); 
 const [markerSpan, setMarkerSpan] = useState([])
 const [updateViewport, setUpdateViewport] = useState(true);
 const [selectedTrip, setSelectedTrip] = useState(0);


 useEffect(() => {

  if(markerSpan.length !== 0) {  
    const markerCenter = [((markerSpan[0][0]+markerSpan[1][0])/2), ((markerSpan[0][1] + markerSpan[1][1])/2)]
      flyTo(markerCenter[1], markerCenter[0])

  }
}, [markerSpan]);



 useEffect(() => {
    placeCategoryRef.current = placeCategory;
 }, [placeCategory]);


 const flyTo = (newLat, newLong) => {
  if(mapRef.current) {
    mapRef.current.flyTo({
      center: [newLong, newLat],
      essential: true,
    });
    setUpdateViewport(false); // disable onViewportChange callback
    setTimeout(() => setUpdateViewport(true), 200); // reenable after flyTo animation 
  }
};

 const getMinOrMax = (markers, minOrMax, latOrLng) => {
  if (minOrMax === "max") {
     return maxBy(markers, location => location[latOrLng])[latOrLng];
  } else {
     return minBy(markers, location => location[latOrLng])[latOrLng];
  }
 };

 const handleDblClick = useCallback(
    async (e) => {
      const deleteRes = await deleteAllPlaceDetails();
      const currentPlaceCategory = placeCategoryRef.current;
      const nearbyPlaces = await getNearbyPlacesByCategory(e.lngLat.lat, e.lngLat.lng, currentPlaceCategory);
      const fetchDetailsPromises = nearbyPlaces.data.map(nearbyPlace => 
        getLocationDetails(nearbyPlace.location_id)
           .then(details => {
             if(details.location_id) {
              savePlaceDetails(details);
             }
             return details;
           })
       );
      const nearbyDetails = await Promise.all(fetchDetailsPromises);
      const filteredNearbyDetails = nearbyDetails.filter(place => place.hasOwnProperty('location_id'))
      setNearbyPlaceDetails(filteredNearbyDetails);
      setMarkerSpan(getBounds(filteredNearbyDetails))
    },
    []
 );

 const handleViewportChange = (newViewport) => {
  setViewport(newViewport);
 };

 const handleMarkerClick = (place) => {
    setSelectedPlace(place);
 };

 const getBounds = (markers) => {
  let filteredMarkers = markers.filter(marker => marker.hasOwnProperty('latitude') && marker.hasOwnProperty("longitude"))
  if (filteredMarkers.length === 0) {
    return null;
  }
  const maxLat = parseFloat(getMinOrMax(filteredMarkers, "max", "latitude"));
  const minLat = parseFloat(getMinOrMax(filteredMarkers, "min", "latitude"));
  const maxLng = parseFloat(getMinOrMax(filteredMarkers, "max", "longitude"));
  const minLng = parseFloat(getMinOrMax(filteredMarkers, "min", "longitude"));

  if (maxLat === null || minLat === null || maxLng === null || minLng === null) {
    return []; 
  }
 
  const southWest = [minLng, minLat];
  const northEast = [maxLng, maxLat];
  return [southWest, northEast];
 };

 const addPlaceToTrip = async (selectedTripId, selectedPlace) => {
  if (selectedTripId === 0) {
    selectedPlace.categoryId = placeCategory;
    navigate('/trips/new',{state:{place:selectedPlace}});
  }
  else {
    await saveTripAdvisorPlaceToSelectedTrip(selectedTripId, selectedPlace, placeCategory);
    const updatedTrips = await getTripsWithPlaces(currentUser.id)
    const setTripsResponse = await setTrips(updatedTrips)
    setUpdateTrips(true);
  }
  

 }

 return (
  <>
  
    <MapGL
      ref={mapRef}
      initialViewState={viewport}
      mapboxAccessToken={TOKEN}
      mapStyle="mapbox://styles/sightsee-admin/clv65kdd702s401pk1yu1dsi8/draft"
      transitionDuration="200"
      onViewportChange={handleViewportChange}
      onDblClick={handleDblClick}
      doubleClickZoom={false}
      // {...viewport}
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
        style={{ maxWidth: '200px' }} 
     >
        <div style={{ padding: '10px' }}>
          <h3 style={{ color: 'var(--primary)' }}>{selectedPlace.name}</h3>
          {selectedPlace.description && (
            <p style={{ fontSize: '0.8em', marginTop: '5px', color: 'var(--dark)' }}>
              {selectedPlace.description.length > 100 ? 
            `${selectedPlace.description.substring(0, 150)}...` : 
            selectedPlace.description}</p>
          )}
          {selectedPlace.rating_image_url && (
            <img src={selectedPlace.rating_image_url} alt="Rating" style={{ width: '100%', marginTop: '10px', marginLeft: '-13px' }} />
          )}
          <button className='btn-add' style={{ marginLeft: '-5px', width: '155px', backgroundColor: 'var(--primary)', padding: '4px' }} onClick={() => addPlaceToTrip(selectedTrip, selectedPlace)}>
                                <img src={plus_button} style={{ height: '20px', width: '20px'}} alt='Add trip'/>
                            </button> 
        </div>
        </Popup>
      )}
    </MapGL>
    <CategorySelect placeCategory={placeCategory} setPlaceCategory={setPlaceCategory} />
    <TripSelector selectedTrip={selectedTrip} setSelectedTrip={setSelectedTrip} trips={trips} />

    </>
 );
};
