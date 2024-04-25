export const getTripActivities = (tripId) => {
    return fetch(`http://localhost:8088/activities?tripId=${tripId}`).then(res => res.json())
}

export const deleteTripActivities = async (tripId) => {
    try {
        const tripActivities = getTripActivities(tripId);
        const deleteOptions = {
            method: "DELETE"
        }
        //map to batch delete matching activities
        const deletePromises = tripActivities.map(activity => {
            return fetch(`http://localhost:8088/activities?id=${activity.id}`, deleteOptions);
        })
        await Promise.all(deletePromises);
        console.log(`Trip activities deleted successfully.`)
        }
    catch (error) {
        console.error(`Error deleting activities`, error);
        }
}