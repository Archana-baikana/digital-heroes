
import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()

  // Logged-in user details
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          Digital Heroes
        </Link>

        <div className="navbar-links">

          <Link to="/">Home</Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/scores">
            Scores
          </Link>

          <Link to="/charities">
            Charities
          </Link>

          <Link to="/draws">
            Draws
          </Link>

          <Link to="/winners">
            Winners
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          )}

          {user ? (
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar