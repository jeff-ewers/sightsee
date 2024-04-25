export const getTripPlaces = (tripId) => {
    return fetch(`http://localhost:8088/activities?tripId=${tripId}&_expand=trip&_expand=place`).then(res => res.json());
}

export const getAllPlacesWithCategory = () => {
    return fetch(`http://localhost:8088/places?_expand=category`).then(res => res.json());
}

export const deletePlaceFromTrip = (activityId) => {
    const deleteOptions = {
        method: "DELETE"
    }
    return fetch(`http://localhost:8088/activities/${activityId}`, deleteOptions)
}