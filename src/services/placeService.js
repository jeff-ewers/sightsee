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

export const deleteAllPlaceDetails = async () => {
    try {
        const allPlaceDetails = await getAllPlaceDetails();
        console.log(allPlaceDetails)
        const deleteOptions = {
            method: "DELETE"
        }
        //map to batch delete matching activities
        const deletePromises = allPlaceDetails.map(detailedPlace => {
            return fetch(`http://localhost:8088/placeDetails/${parseInt(detailedPlace.id)}`, deleteOptions);
        })
        await Promise.all(deletePromises);
        console.log(`All place details deleted successfully.`)
        }
    catch (error) {
        console.error(`Error deleting place details`, error);
        }
}

export const getAllPlaceDetails = () => {
    return fetch("http://localhost:8088/placeDetails").then(res => res.json());
}