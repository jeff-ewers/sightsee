import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useState, useContext } from "react"
import { TripsList } from "./TripsList"
import { getTripsWithPlaces } from "../../services/tripService"
import { UpdateTripsContext } from "../../providers/UpdateTripsProvider"
import './TripsList.css'
import { Map } from "../map/Map"

document.body.style = 'background: #004F32;';
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export const Trips = ({currentUser}) => {
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

  
return (
    <div className="trips">
        <div style={{ width: "100vw", height: "450px", zIndex: 10}}>
          <Map>
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