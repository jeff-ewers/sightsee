import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSize } from 'react-hook-size'
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Marker, Popup } from 'react-map-gl';
import { getLocationDetails, getNearbyPlaces, getNearbyPlacesByCategory, pingProxy } from "../../services/tripadvisorService.js";
import { savePlaceDetails } from '../../services/saveService.js';
import { deleteAllPlaceDetails } from '../../services/placeService.js';
import poi_marker from '../../assets/poi-marker.png'
import { CategorySelect } from './CategorySelect.jsx';
import { maxBy, minBy } from 'lodash'
import WebMercatorViewport from 'viewport-mercator-project'
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = ({mapContainerRef}) => {

 const { width, height } = useSize(mapContainerRef)
 const mapRef = useRef();
 const [viewport, setViewport] = useState({
    latitude: 48.85447,
    longitude: 2.302967,
    width: width || "100vw",
    height: height || "100vh",
    pitch: 67,
    zoom: 16
 });

 const [nearbyPlaceDetails, setNearbyPlaceDetails] = useState([]);
 const [selectedPlace, setSelectedPlace] = useState(null);
 const [placeCategory, setPlaceCategory] = useState('hotels');
 const placeCategoryRef = useRef(placeCategory); 
 const [markerSpan, setMarkerSpan] = useState([])


 useEffect(() => {

  if(markerSpan.length !== 0 && width && height) {  
    setViewport(viewport => {
      const currentPitch = viewport.pitch;
      
      const newport = new WebMercatorViewport({
        // ...viewport, 
        width,
        height,
        //pitch: currentPitch,
      }).fitBounds(markerSpan, {padding: 100});
      console.log(newport)
      return newport;
    });
  }
}, [markerSpan, width, height]);

//  useEffect(() => {
//   if(width && height){
//     setViewport((viewport) => ({ 
//       ...viewport, 
//       width, 
//       height 
//     }));
//   }
// }, [width, height]);

 useEffect(() => {
    placeCategoryRef.current = placeCategory;
 }, [placeCategory]);


 const getMinOrMax = (markers, minOrMax, latOrLng) => {
  if (minOrMax === "max") {
    
     return maxBy(markers, location => location[latOrLng])[latOrLng];
  } else {
     return minBy(markers, location => location[latOrLng])[latOrLng];
  }
 };

 const handleDblClick = useCallback(
    async (e) => {
      console.time("nearby places")
      console.log("clearing place details")
      const deleteRes = await deleteAllPlaceDetails();
      const currentPlaceCategory = placeCategoryRef.current;
      console.timeLog("nearby places")
      console.log("fetching nearby places")
      const nearbyPlaces = await getNearbyPlacesByCategory(e.lngLat.lat, e.lngLat.lng, currentPlaceCategory);
      console.timeLog("nearby places")
      const fetchDetailsPromises = nearbyPlaces.data.map(nearbyPlace => 
        getLocationDetails(nearbyPlace.location_id)
           .then(details => {
             console.log("caching place details");
             if(details.location_id) {
              savePlaceDetails(details);
             }
             console.timeLog("nearby places")
             return details;
           })
       );
      console.log("fetching nearby place details")
      const nearbyDetails = await Promise.all(fetchDetailsPromises);
      console.log("setting state");
      const filteredNearbyDetails = nearbyDetails.filter(place => place.hasOwnProperty('location_id'))
      setNearbyPlaceDetails(filteredNearbyDetails);
      console.timeLog("nearby places")
      console.log("calling getbounds")
      setMarkerSpan(getBounds(filteredNearbyDetails))
      console.timeLog("nearby places")
      console.timeEnd("nearby places")
      
    },
    []
 );



 const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
    // return newViewport;
 }, []);

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
    return []; // return an empty array if any of the min/max values are null
  }
 
  const southWest = [minLng, minLat];
  const northEast = [maxLng, maxLat];
  return [southWest, northEast];
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
