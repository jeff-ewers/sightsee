
import { useState, useEffect } from "react"
import { UserViews } from "./UserViews.jsx"


export const ApplicationViews = () => {

const [currentUser, setCurrentUser] = useState({});


useEffect(() => {
  const localSightseeUser = localStorage.getItem("sightsee_user");
  const sightseeUserObject = JSON.parse(localSightseeUser);
  setCurrentUser(sightseeUserObject);
}, [])



  return (
  <UserViews currentUser={currentUser}/> 
  ) 

      
    
}
