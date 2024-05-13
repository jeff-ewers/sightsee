const TOKEN = import.meta.env.VITE_TRIPADVISOR_TOKEN


export const getNearbyPlaces = (lat, long) => {
    const proxyUrl = 'http://localhost:3000/api';
    const apiUrl = `/location/nearby_search?latLong=${lat}%2C%20${long}&language=en&key=${TOKEN}`;
    const url = `${proxyUrl}${apiUrl}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
  
  console.log(url)
    return fetch(url, options)
      .then(response => response.json())
      .catch(err => console.error(err));
  };

  export const pingProxy = () => {
    fetch('http://localhost:3000/hello')
    .then(response => response.text())
    .then(data => console.log(data)) // Output: Hello World
    .catch(error => console.error(error));
  }

  export const getLocationDetails = (locationId) => {
    const proxyUrl = 'http://localhost:3000/api';
    const apiUrl = `/location/${locationId}/details?key=${TOKEN}&language=en&currency=USD`;
    const url = `${proxyUrl}${apiUrl}`;
  
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
  
    return fetch(url, options)
      .then(response => response.json())
      .catch(err => console.error(err));
  };

  export const getNearbyPlacesByCategory = (lat, long, categoryId) => {
    let categoryString = ``
    var category = ""
    switch (categoryId) {
      case "1":
        category = "hotels";
        break;
      case "2":
        category = "attractions";
        break;
      case "3": 
        category = "restaurants";
        break;
      default:
        break;
    }
    if(category) {
      categoryString += `&category=${category}`
    }

    const proxyUrl = 'http://localhost:3000/api';
    const apiUrl = `/location/nearby_search?latLong=${lat}%2C%20${long}&key=${TOKEN}${categoryString}&language=en`;
    const url = `${proxyUrl}${apiUrl}`;
    console.log(url)
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
  
  
    return fetch(url, options)
      .then(response => response.json())
      .catch(err => console.error(err));
  };

  export const searchNearby = (searchQuery, viewport, categoryId) => {
    const lat = viewport.latitude;
    const long = viewport.longitude;
    let radius = 1;
    let radiusUnit = "km"
    let categoryString = ``
    var category = ""
    switch (categoryId) {
      case "1":
        category = "hotels";
        break;
      case "2":
        category = "attractions";
        break;
      case "3": 
        category = "restaurants";
        break;
      default:
        break;
    }
    if(category) {
      categoryString += `&category=${category}`
    }

    const proxyUrl = 'http://localhost:3000/api';
    //Add ${categoryString} to apiUrl for category search
    const apiUrl = `/location/search?searchQuery=${searchQuery}&latLong=${lat}%2C%20${long}&radius=${radius}&radiusUnit=${radiusUnit}&key=${TOKEN}&language=en`;
    const url = `${proxyUrl}${apiUrl}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
  
  
    return fetch(url, options)
      .then(response => response.json())
      .catch(err => console.error(err));
  }