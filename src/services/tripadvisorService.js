const TOKEN = import.meta.env.VITE_TRIPADVISOR_TOKEN

// export const getNearbyPlaces = (lat, long) => {
//     const options = {method: 'GET', headers: {accept: 'application/json'}};
//     return fetch(`https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${lat}%2C%20${long}&key=D503299DFF0F4DFC9FB1C7EC1DD79911&language=en`, options)
//     .then(response => response.json())
//     .catch(err => console.error(err));
// }



export const getNearbyPlaces = (lat, long) => {
    const proxyUrl = 'http://localhost:3000/api';
    const apiUrl = `?latLong=${lat}%2C%20${long}&key=${TOKEN}&language=en`;
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

  // export const pingProxy = () => {
  //   fetch('http://localhost:3000/hello')
  //   .then(response => response.text())
  //   .then(data => console.log(data)) // Output: Hello World
  //   .catch(error => console.error(error));
  // }