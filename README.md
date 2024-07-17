![sightsee-logo-flat](https://github.com/user-attachments/assets/24f35600-d23e-4b10-9e75-e42fd4434cc1)


# Welcome to sightsee!

Sightsee is an interactive web application for trip planning, featuring a 3D mapping interface and full CRUD functionality for exploring and collecting points of interest (POIs).


<img width="1504" alt="Screenshot 2024-07-17 at 10 11 15 AM" src="https://github.com/user-attachments/assets/6d373c0d-f3fb-4d98-bf49-57bda7d55ad7">


## Features

- Interactive 3D map interface using Mapbox API
- Search and explore points of interest powered by Tripadvisor API
- Create, read, update, and delete custom POI collections
- Responsive design for desktop and mobile devices

## Tech Stack

- Frontend: React.js with Vite
- Backend: json-server (prototype)
- APIs: Mapbox, Tripadvisor

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```
git clone https://github.com/jeff-ewers/sightsee.git
cd sightsee
```
2. Install dependencies:

```
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your API keys:

```
VITE_MAPBOX_API_KEY=your_mapbox_api_key
VITE_TRIPADVISOR_API_KEY=your_tripadvisor_api_key
```

4. Start the development server:

```
npm run dev
```

5. In a separate terminal, start json-server:

```
json-server database.json -p 8088 -w
```

6. Open your browser and navigate to `http://localhost:5173` to view the application.

## Usage

login with the default user, jeff@sightsee.ing


<img width="1498" alt="Screenshot 2024-07-17 at 10 11 03 AM" src="https://github.com/user-attachments/assets/3b0cbe42-310b-4af7-8ecb-bf096d9ec22c">


To navigate to the map interface, select 'trips' in the navbar:


<img width="1504" alt="Screenshot 2024-07-17 at 10 11 15 AM arrow" src="https://github.com/user-attachments/assets/110e757f-674e-4189-a6dc-807b0a7f0ad6">


sightsee supports most common touchpad map-navigation gestures, including pinch-to-zoom and two-finger camera control. The user can double-click any location, and the system will populate nearby points of interest, zooming to fit the displayed POI's. 


<img width="1524" alt="Screenshot 2024-07-17 at 10 11 45 AM" src="https://github.com/user-attachments/assets/a77caaf4-d23a-465b-aaa2-8b575fc9c1d5">


A category selector allows for only specific POI categories to be fetched, and the search bar will return results for any POI query. The search functionality defaults to unfiltered search, but accounts for the user's current category selection. 

Clicking on a POI will display a dynamic popup window with place information. Collecting the POI is as simple as clicking the \[+] button on the popup window. If the user has not selected a trip, this will navigate to a trip creation screen and populate the selected POI. Existing trips can be added to by selecting them with the drop-down selection menu. 

Existing trips as well as a New Trip Creation selection can be found below the map. The user can inspect trip details, as well as modify and delete existing trips.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Mapbox](https://www.mapbox.com/)
- [Tripadvisor](https://www.tripadvisor.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [json-server](https://github.com/typicode/json-server)
