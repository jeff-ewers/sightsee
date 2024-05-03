import { getTripActivities } from "./activitiesService";
import { getAllPlaces } from "./placeService";


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
                                tripId: parseInt(savedTrip.id),
                                placeId: parseInt(savedPlace.id),
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

export const saveTripAdvisorPlaceToSelectedTrip = async (tripId, place, categoryId) => {
    debugger
    //get all places, check for existing entry by ?location_id
    const allPlaces = await getAllPlaces();
    let foundId = undefined;
    let savedId = undefined;
    
    const isNewPlace = (place, allPlaces) => {
        for (const savedPlace of allPlaces) {
            if (savedPlace?.location_id === place.location_id) {
                //get id if present
                foundId = savedPlace.id;
                return false;
            }}
                return true;
        }
    isNewPlace(place, allPlaces);
    //if not found
    if(foundId === undefined) {
        place = {
            ...place,
            categoryId: parseInt(categoryId),
        }
        //save place if not already saved with categoryId
        const savedPlace = await savePlace(place);
        savedId = savedPlace?.id;
    }
    //if place already exists
    if (foundId) {
        //check if trip contains activity associated with selected place
        const tripActivities = await getTripActivities(tripId);
        const isNewActivity = (tripId, foundId) => {
            for (const activity of tripActivities) {
                if ( activity.placeId === foundId && activity.tripId === tripId ) {
                    return false;
                }
            }
            return true;
        }
        if(isNewActivity(tripId, foundId)) {
            //if it's a new trip activity, create activity linking trip and place
            saveActivity(tripId, foundId)
        }
    }
    //if newly saved place, create activity linking trip to place
    if (savedId) {
        saveActivity(tripId, savedId)
    }
 
}

export const savePlace = async (place) => {
    return await fetch('http://localhost:8088/places', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(place),
                })
                .then(response => response.json())
}

export const saveActivity = (tripId, placeId) => {
    return fetch('http://localhost:8088/activities', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                tripId: parseInt(tripId),
                                placeId: parseInt(placeId),
                        }),
                    })
}