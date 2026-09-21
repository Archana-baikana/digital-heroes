
import {Link} from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">PLAY • GIVE • IMPACT</p>

          <h1>
            Play for a chance to win.
            <span> Give back with purpose.</span>
          </h1>

          <p className="hero-description">
            Digital Heroes brings monthly rewards together with
            meaningful charity contributions. Subscribe, enter your
            scores, participate in the draw and make an impact.
          </p>

          <div className="hero-buttons">
            <Link to="/subscription" className="primary-button">
              Subscribe Now
            </Link>

            <Link to="/charities" className="secondary-button">
              Explore Charities
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="impact-icon">✦</div>
          <p>YOUR PARTICIPATION</p>
          <h2>CAN CREATE</h2>
          <h2>REAL IMPACT</h2>

          <div className="hero-card-line" />

          <span>
            Rewards + Charity + Community
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section">
        <div className="section-title">
          <p>HOW IT WORKS</p>
          <h2>Simple to join. Meaningful to share.</h2>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Subscribe</h3>
            <p>
              Choose a monthly or yearly subscription
              and become part of Digital Heroes.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Enter Scores</h3>
            <p>
              Add your latest Stableford scores and
              keep your score history updated.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Join the Draw</h3>
            <p>
              Participate in the monthly draw for
              opportunities to win rewards.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Make an Impact</h3>
            <p>
              Support a charity of your choice while
              participating in the Digital Heroes community.
            </p>
          </div>

        </div>
      </section>

      {/* WHY DIGITAL HEROES */}
      <section className="impact-section">
        <div className="impact-content">
          <p className="section-label">WHY DIGITAL HEROES</p>

          <h2>
            Every participation can
            <span> mean something more.</span>
          </h2>

          <p>
            Digital Heroes is designed to combine participation,
            rewards and charitable giving in one simple experience.
          </p>

          <Link to="/charities" className="text-button">
            Discover our charity community →
          </Link>
        </div>

        <div className="impact-points">

          <div className="impact-point">
            <strong>01</strong>
            <div>
              <h3>Monthly Rewards</h3>
              <p>
                Participate in recurring monthly draws.
              </p>
            </div>
          </div>

          <div className="impact-point">
            <strong>02</strong>
            <div>
              <h3>Choose Your Charity</h3>
              <p>
                Support causes that matter to you.
              </p>
            </div>
          </div>

          <div className="impact-point">
            <strong>03</strong>
            <div>
              <h3>Transparent Experience</h3>
              <p>
                Track scores, participation and winnings
                from your dashboard.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CHARITY CTA */}
      <section className="charity-cta">
        <div>
          <p>YOUR CHOICE MATTERS</p>
          <h2>Play with purpose.</h2>
          <span>
            Choose a cause and help turn participation into
            positive community impact.
          </span>
        </div>

        <Link to="/charities" className="cta-button">
          View Charities
        </Link>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <p>READY TO GET STARTED?</p>
        <h2>Become a Digital Hero.</h2>

        <Link to="/subscription" className="primary-button">
          Join Now
        </Link>
      </section>

    </div>
  )
}

export default Home