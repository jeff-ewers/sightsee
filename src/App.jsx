import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { Authorized } from "./views/Authorized";
import { ApplicationViews } from "./views/ApplicationViews";
import { UpdateTripsProvider } from "./providers/UpdateTripsProvider";

function App() {
  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={
      <Authorized>
        <UpdateTripsProvider>
          <ApplicationViews />
        </UpdateTripsProvider>
      </Authorized>
    } />
    </Routes>
    </>
   );
}

export default App;
