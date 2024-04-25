import React, { createContext, useState } from 'react';

export const UpdateTripsContext = createContext();

export const UpdateTripsProvider = ({ children }) => {
 const [updateTrips, setUpdateTrips] = useState(false);

 return (
    <UpdateTripsContext.Provider value={{ updateTrips, setUpdateTrips }}>
      {children}
    </UpdateTripsContext.Provider>
 );
};
