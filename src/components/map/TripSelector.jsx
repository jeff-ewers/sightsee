import { Link } from "react-router-dom";

export const TripSelector = ({selectedTrip, setSelectedTrip, trips}) => {
const handleSelection = (event) => {
    setSelectedTrip(event.target.value);
}
return (
    <div style={{
        position: 'absolute',
        top: '50px',
        left: '10px',
        backgroundColor: 'rgb(59, 59, 59, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        color: 'var(--offWhite)',
        fontFamily: "Nunito"
      }}>
        <label htmlFor="tripSelected">Trip: </label>
        <select id="tripSelected" value={selectedTrip} onChange={handleSelection}>
            <option key="0" value="0" disabled>Select a trip</option>   
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>{trip.name}</option>
          ))}
        </select>
      </div>
)
}