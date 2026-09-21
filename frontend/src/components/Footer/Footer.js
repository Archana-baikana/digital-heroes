
import {Link} from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Digital Heroes
          </Link>

          <p>
            Play with purpose. Participate, support
            meaningful causes and make an impact.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/charities">Charities</Link>
          <Link to="/draws">Draws</Link>
          <Link to="/winners">Winners</Link>
        </div>

        <div className="footer-column">
          <h3>Account</h3>

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/scores">Scores</Link>
          <Link to="/subscription">Subscription</Link>
        </div>

        <div className="footer-column">
          <h3>Get Started</h3>

          <p>
            Ready to become a Digital Hero?
          </p>

          <Link
            to="/subscription"
            className="footer-button"
          >
            Join Now
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Digital Heroes. All rights reserved.
        </p>

        <p>
          Built with purpose.
        </p>
      </div>
    </footer>
  )
}

export default Footer