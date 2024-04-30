import { getTripActivities } from "./activitiesService";


export const saveTripAndPlaces = async (transientTrip, transientPlaces) => {
    const tripActivities = await getTripActivities(transientTrip?.id);
    //define options based upon new vs existing trip
    const isNew = (transientTrip.id === null);
    const endpoint = isNew ?  'http://localhost:8088/trips' : `http://localhost:8088/trips/${transientTrip.id}`;
    const method = isNew ? 'POST' : 'PUT';
    //test whether activity exists in the database
    const isNewActivity = (savedPlace, savedTrip) => {
        for (const activity of tripActivities) {
            if ( activity.placeId === savedPlace.id && activity.tripId === savedTrip.id ) {
                return false;
            }
        }
        return true;
    }
    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transientTrip),
    }) 
    .then(response => response.json())
    .then(async savedTrip => {
        //save new places and create activities
        const promises = transientPlaces.map(place => {
            if (!place.id) {
                //if place has no id, it is new, so save it
                return fetch('http://localhost:8088/places', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(place),
                })
                .then(response => response.json())
                .then(savedPlace => {
                    
                    //if the activity entry is new
                    if (isNewActivity(savedPlace, savedTrip)) {
                        //create activity linking the trip and the place
                        return fetch('http://localhost:8088/activities', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                tripId: savedTrip.id,
                                placeId: savedPlace.id,
                        }),
                        })
                    }
                    }
                    
                    
                );
            } else {
                
                // if place already exists, then just create activity
                if (isNewActivity(place, savedTrip)) {
                return fetch('http://localhost:8088/activities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tripId: savedTrip.id,
                        placeId: place.id,
                    }),
                });
            }
            }
        });

        return await Promise.all(promises);
    })
    .then(() => {
        console.log("Trip and places saved successfully.");

    })
    .catch(error => {
        console.error("Error saving trip and places:", error);
    });
};

export const savePlaceDetails = (placeDetails) => {
    return fetch('http://localhost:8088/placeDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeDetails),
    })
    .then(response => response.json());
}