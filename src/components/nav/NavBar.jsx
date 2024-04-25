import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () =>{
    const navigate = useNavigate()

    return(
        <ul className="navbar">
           <li className="navbar-item">
            <Link to='/'>sightsee</Link>
          </li>
          <li className="navbar-item navbar-trips">
              <Link to='/trips'>trips</Link>
          </li>
        {localStorage.getItem("sightsee_user") ? (
  <li className="navbar-item navbar-logout">
    <Link
      className="navbar-link"
      to=""
      onClick={() => {
        localStorage.removeItem("sightsee_user")
        navigate("/", { replace: true })
      }}
    >
      logout
    </Link>
  </li>
) : (
  ""
)}
    </ul>
)}