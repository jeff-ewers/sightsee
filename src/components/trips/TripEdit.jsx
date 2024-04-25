import { POIForm } from "./POIForm";
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveTripAndPlaces } from "../../services/saveService";
import trashIcon from '../../assets/trash.png'
import './TripEdit.css';
import { deletePlaceFromTrip } from "../../services/placeService";
import { getTripActivities } from "../../services/activitiesService";
import { UpdateTripsContext } from "../../providers/UpdateTripsProvider"

export const TripEdit = ({currentUser}) => {

    document.body.style = 'background: #004F32;';
    const location = useLocation();
    const navigate = useNavigate()
    var trip = location.state?.trip;
    const [transientTrip, setTransientTrip] = useState({
        name: trip ? trip.name : "",
        desc: trip ? trip.desc : "",
        id: trip ? trip.id : null,
        userId: currentUser.id,
    });
    const [transientPlaces, setTransientPlaces] = useState(trip ? trip.places : []);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false); // state to toggle save button
    const [stateUpdateComplete, setStateUpdateComplete] = useState(false);
    const { updateTrips, setUpdateTrips } = useContext(UpdateTripsContext); 


    useEffect(() => {
        setTransientTrip(prevState => ({ ...prevState, userId: currentUser.id }));
    }, [currentUser]);

    useEffect(() => {
        if(stateUpdateComplete) {
            setStateUpdateComplete(false)
            navigate('/trips')
        }
    }, [stateUpdateComplete]);

    // handle form submission
    const handleSaveTrip = async (event) => {
        event.preventDefault(); // prevent default form submission and full page reload
        if(transientTrip.name !== "" && transientTrip.desc !== "") {
            setIsSaveEnabled(true);
        }
        await saveTripAndPlaces(transientTrip, transientPlaces);
        setUpdateTrips(true);
        setStateUpdateComplete(true);
    };

    // function to handle input changes and enable/disable save button
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        //use computed property key in object literal to update state
        setTransientTrip(prevState => ({ ...prevState, [name]: value }));
        setIsSaveEnabled(
            (transientTrip.name && transientTrip.desc)
            ); // enable save button if both name and desc are filled
    };

    // function to pass to POI form which adds POI to state
    const addPlaceToTransientTrip = (place) => {
        setTransientPlaces(transientPlaces => [...transientPlaces, place]);
        setIsSaveEnabled(true);
    };

    const removePlace = async (tripId, place) => {
        if (transientTrip.id === null) {
            //remove place from state if it's a new place on a new trip
            setTransientPlaces(transientPlaces => transientPlaces.filter(p => p.name !== place.name));
        }
        else if (place.id === null) {
            //remove place from state if it's a new place on an existing trip
            setTransientPlaces(transientPlaces => transientPlaces.filter(p => p.name !== place.name));
        }
        else if (tripId !== null && place.id !== null) {
            const activityId = await getActivityId(tripId, place.id)
            //remove place from DB if its an existing place on an existing trip
            deletePlaceFromTrip(activityId);
            //remove place from state
            setTransientPlaces(transientPlaces => transientPlaces.filter(p => p.id !== place.id));
        }
        setIsSaveEnabled(true);
    }

    const getActivityId = async (tripId, placeId) => {
        const tripActivities = await getTripActivities(tripId);
        const activity = tripActivities.find(activity => activity.placeId === placeId);
        return activity.id;
    }

    return (
        <div className="trip-edit__container">
            <div className="trip-edit__title">
                <h2>{trip ? `Edit ${trip.name}` : `Edit new trip`}</h2>
            </div>
            <POIForm currentUser={currentUser}
                    addPlaceToTransientTrip={addPlaceToTransientTrip}
            />
            <div className="trip-edit__poi-list">
                {transientPlaces?.length ? transientPlaces.map((place, index) => (
                    //generate unique key if place.id is undefined
                    <section key={place.id ? place.id : `new-${Date.now()}-${index}`} className="place">
                        <h2>{place.name}</h2>
                        <h3>{place.desc}</h3>
                        <button className='btn-delete' onClick={() => removePlace(trip?.id, place)}>
                                <img src={trashIcon} alt='Delete'/>
                            </button>
                    </section>
                )) : null}
            </div>
            <div className="trip-edit__save-form">
                
                <form onSubmit={handleSaveTrip}>
                    <h2>Save Trip</h2>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={transientTrip.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="desc"
                            value={transientTrip.desc}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className='btn-primary' type="submit" disabled={!isSaveEnabled}>Save</button>
                </form>
            </div>
        </div>
    );
};
