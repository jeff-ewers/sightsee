import "mapbox-gl/dist/mapbox-gl.css"
import { useState, useRef, useEffect } from 'react'
import mapboxgl from "mapbox-gl"
import './Map.css'
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lnaHRzZWUtYWRtaW4iLCJhIjoiY2x2NjUyeWNiMDcxaTJpcDR0OXp3a3g4bSJ9.An4bTpQ71R37k8c-9bRyQw';

export const Map = () => {
    
      const mapContainer = useRef(null);
      const map = useRef(null);
      const [lng, setLng] = useState(-70.9);
      const [lat, setLat] = useState(42.35);
      const [zoom, setZoom] = useState(9);
    
      useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom
        });
    
        map.current.on('move', () => {
          setLng(map.current.getCenter().lng.toFixed(4));
          setLat(map.current.getCenter().lat.toFixed(4));
          setZoom(map.current.getZoom().toFixed(2));
        });
      });
    
      return (
        <div>
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={mapContainer} className="map-container" />
        </div>
      );
    }