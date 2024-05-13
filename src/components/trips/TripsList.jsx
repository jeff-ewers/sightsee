
import { Link} from "react-router-dom"
import './TripsList.css'
import trashIcon from '../../assets/trash.png'
import { deleteTrip } from "../../services/tripService"
import { useEffect, useState } from "react"
import sample0 from '../../assets/sample0.jpeg';
import sample1 from '../../assets/sample1.jpeg';
import sample2 from '../../assets/sample2.jpeg';
import sample3 from '../../assets/sample3.jpeg';
import sample4 from '../../assets/sample4.jpeg';
import sample5 from '../../assets/sample5.jpeg';
import sample6 from '../../assets/sample6.jpeg';
import sample7 from '../../assets/sample7.jpeg';


export const TripsList = ({currentUser, trips, setTrips, updateTrips, setUpdateTrips}) => {

const [localTrips, setLocalTrips] = useState([]);
const sampleImages = [sample0, sample1, sample2, sample3, sample4, sample5, sample6, sample7];

useEffect(() => {
    setLocalTrips(trips)
}, [trips])

document.body.style = 'background: #004F32;';

const removeTrip = (event, tripId) => {
    //prevent Link event on delete button
    event.preventDefault();
    //prevent event from reaching Link
    event.stopPropagation();
    deleteTrip(tripId).then(() => {
        //update component state after deletion
        setLocalTrips(localTrips.filter((trip) => trip.id !== tripId));
        setTrips(trips.filter(trip => trip.id !== tripId));
    });
    window.alert(`Trip deleted.`)
    window.location.reload();
}

const getImageByKey = (tripId) => {
    const imagePath = sampleImages[tripId];
    return `url(${imagePath})`;
  };

  return (
    <article className="trips-list">
      <Link key={0} to={`/trips/new`} state={{ currentUser: currentUser }}>
        <section className="trip" style={{ "--random-image": getImageByKey(0) }}>
          <h2>New Trip</h2>
          <h3>Create an experience.&nbsp;</h3>
        </section>
      </Link>
      {localTrips?.length
        ? localTrips.map((trip) => {
            return (
              <Link key={trip.id} to={`/trips/${trip.id}`} state={{ trip: trip }}>
                <section
                  key={trip.id}
                  className="trip"
                  style={{ "--random-image": getImageByKey(trip.id) }}
                >
                  <h2>{trip.name}</h2>
                  <h3>{trip.description}</h3>
                  <button className="btn-delete" onClick={(event) => removeTrip(event, trip.id)}>
                    <img src={trashIcon} alt="Delete" />
                  </button>
                </section>
              </Link>
            );
          })
        : null}
    </article>
  );
};



