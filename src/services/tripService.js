export const getUserTrips = (userId) => {
    return fetch(`http://localhost:8088/trips?userId=${userId}`).then(res => res.json());
}

export const getAllTrips = () => {
    return fetch(`http://localhost:8088/trips`).then(res => res.json());
}

export const  getTripsWithPlaces = (userId) => {
    //fetch all trips associated with the given userId
    return fetch(`http://localhost:8088/trips?userId=${userId}`)
        .then(response => response.json())
        .then(trips => {
            //for each trip, fetch all activities associated with it
            const tripPromises = trips.map(trip => {
                return fetch(`http://localhost:8088/activities?tripId=${trip.id}`)
                    .then(response => response.json())
                    .then(async activities => {
                        //for each activity, fetch the corresponding place
                        const placePromises = activities.map(activity => {
                            return fetch(`http://localhost:8088/places/${activity.placeId}`)
                                .then(response => response.json());
                        });
                        return await Promise.all(placePromises)
                            .then(places => {
                                //append the places to the trip object
                                trip.places = places;
                                return trip;
                            });
                    });
            });
            return Promise.all(tripPromises);
        });
}

export const deleteTrip = (tripId) => {
    const deleteOptions = {
        method: "DELETE"
    }
    return fetch(`http://localhost:8088/trips/${tripId}`, deleteOptions).then(res => res.json());
}