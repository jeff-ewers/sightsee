import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useState, useContext, useMemo } from "react"
import Map from 'react-map-gl'
import { Marker } from "react-map-gl"
import mapboxgl from "mapbox-gl"
import { TripsList } from "./TripsList"
import { getTripsWithPlaces } from "../../services/tripService"
import { UpdateTripsContext } from "../../providers/UpdateTripsProvider"
import './TripsList.css'
import { getNearbyPlaces, pingProxy } from "../../services/tripadvisorService"
// import { Map } from "../map/Map"

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export const Trips = ({currentUser}) => {
    const [newPlace, setNewPlace] = useState(null);
    const [viewport, setViewport] = useState({
    //   Nashville lat/long
    //   latitude: 36.1718,
    //   longitude: -86.785, 
    // ---
    //Paris V
      latitude: 48.858093, 
      longitude: 2.299694,
      width: "100vw",
      height: "100vh",
      pitch: 67,
      zoom: 15 
    })
    const [trips, setTrips] = useState([])
    const { updateTrips, setUpdateTrips } = useContext(UpdateTripsContext);
    


    useEffect(() => {
        getTripsWithPlaces(currentUser.id).then(userTrips => {setTrips(userTrips)})
    }, [currentUser.id])
    
    useEffect(() => {
        if(updateTrips) {
            getTripsWithPlaces(currentUser.id).then(userTrips => {setTrips(userTrips)})
            setUpdateTrips(false)
        }
    }, [updateTrips, setUpdateTrips])


    const handleDblClick = async (e) => {
      // setNewPlace([
      //   e.lngLat.lat,
      //   e.lngLat.lng
      // ]);

      //tripadvisor api fetch
      let nearbyPlaces = await getNearbyPlaces(e.lngLat.lat, e.lngLat.lng);
      console.log(nearbyPlaces)
    }
    document.body.style = 'background: #004F32;';
    // const popup = useMemo(() => {
    //   return new mapboxgl.Popup().setText('Location found');
    // }, [])


  
return (
    <div className="trips">
        <div style={{ width: "100vw", height: "450px", zIndex: 10}}>
          {/* <Map>
          //Map.jsx (mapbox-gl implementation)
          </Map> */}
      <Map 
      initialViewState={viewport}
      mapboxAccessToken={TOKEN}
      mapStyle="mapbox://styles/sightsee-admin/clv65kdd702s401pk1yu1dsi8/draft"
      transitionDuration='200'
      onViewportChange={(viewport) => setViewport(viewport)}
      onDblClick={handleDblClick}
      >
        {newPlace ? (
          <Marker>
            latitude={newPlace?.lat}
            longitude={newPlace?.lng}
            offsetLeft={-3.5*viewport.zoom}
            offsetTop={-3.5*viewport.zoom}
            {/* popup={popup} */}
          </Marker>
       ) : null}
      </Map>
      </div>
      <div className="trips-list__container">
        <TripsList 
        key={trips.length}
        currentUser={currentUser} 
        trips={trips} 
        setTrips={setTrips} 
        updateTrips={updateTrips} 
        setUpdateTrips={setUpdateTrips}/>
      </div>
    </div>
)
}