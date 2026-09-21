
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import API_URL from '../../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const [subscription, setSubscription] = useState(null)
  const [scores, setScores] = useState([])
  const [charity, setCharity] = useState(null)
  const [winners, setWinners] = useState([])
  const [draws, setDraws] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [
          subscriptionResponse,
          scoresResponse,
          charityResponse,
          winnersResponse,
          drawsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/subscriptions/my`, {
            headers,
          }),

          fetch(`${API_URL}/api/scores/my`, {
            headers,
          }),

          fetch(`${API_URL}/api/charities/my`, {
            headers,
          }),

          fetch(`${API_URL}/api/winners/my`, {
            headers,
          }),

          fetch(`${API_URL}/api/draws/published`, {
            headers,
          }),
        ])

        // Subscription
        if (subscriptionResponse.ok) {
          const data = await subscriptionResponse.json()
          setSubscription(data.subscription)
        }

        // Scores
        if (scoresResponse.ok) {
          const data = await scoresResponse.json()
          setScores(data.scores || [])
        }

        // Charity
        if (charityResponse.ok) {
          const data = await charityResponse.json()
          setCharity(data.charity)
        }

        // Winners
        if (winnersResponse.ok) {
          const data = await winnersResponse.json()
          setWinners(data.winners || [])
        }

        // Published Draws
        if (drawsResponse.ok) {
          const data = await drawsResponse.json()
          setDraws(data.draws || [])
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Manage your Digital Heroes journey in one place.</p>
      </div>

      {/* Subscription */}
      <section className="dashboard-card">
        <h2>Subscription</h2>

        {subscription ? (
          <div className="dashboard-info">
            <p>
              <strong>Plan:</strong> {subscription.plan}
            </p>

            <p>
              <strong>Amount:</strong> ₹{subscription.amount}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status-active">
                {subscription.status}
              </span>
            </p>

            <p>
              <strong>Start Date:</strong>{' '}
              {subscription.start_date}
            </p>

            {subscription.renewal_date && (
              <p>
                <strong>Renewal Date:</strong>{' '}
                {subscription.renewal_date}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p>No active subscription found.</p>

            <button
              type="button"
              onClick={() => navigate('/subscription')}
              className="dashboard-subscribe-button"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </section>

      {/* Scores */}
      <section className="dashboard-card">
        <h2>My Latest Scores</h2>

        {scores.length > 0 ? (
          <div className="score-grid">
            {scores.map(score => (
              <div className="score-item" key={score.id}>
                <span>{score.score}</span>
                <small>{score.score_date}</small>
              </div>
            ))}
          </div>
        ) : (
          <p>No scores added yet.</p>
        )}
      </section>

      {/* Charity */}
      <section className="dashboard-card">
        <h2>My Charity</h2>

        {charity ? (
          <div className="dashboard-info">
            <p>
              <strong>Charity:</strong>{' '}
              {charity.charities?.name || 'Selected Charity'}
            </p>

            <p>
              <strong>Contribution:</strong>{' '}
              {charity.percentage}%
            </p>

            {charity.charities?.description && (
              <p>
                <strong>About:</strong>{' '}
                {charity.charities.description}
              </p>
            )}
          </div>
        ) : (
          <p>No charity selected yet.</p>
        )}
      </section>

      {/* Draw Participation */}
      <section className="dashboard-card">
        <h2>Monthly Draw</h2>

        {draws.length > 0 ? (
          <div className="draw-dashboard-list">
            {draws.slice(0, 3).map(draw => (
              <div
                className="draw-dashboard-item"
                key={draw.id}
              >
                <div>
                  <h3>Monthly Draw</h3>

                  <p>
                    <strong>Draw Date:</strong>{' '}
                    {draw.draw_date}
                  </p>

                  <p>
                    <strong>Status:</strong>{' '}
                    <span className="status-active">
                      {draw.status}
                    </span>
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Prize Pool:</strong>{' '}
                    ₹{draw.prize_pool}
                  </p>

                  {Number(draw.rollover_amount) > 0 && (
                    <p>
                      <strong>Rollover:</strong>{' '}
                      ₹{draw.rollover_amount}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No published draw available yet.</p>
          </div>
        )}
      </section>

      {/* Winnings */}
      <section className="dashboard-card">
        <h2>My Winnings</h2>

        {winners.length > 0 ? (
          <div className="winners-grid">
            {winners.map(winner => (
              <div
                className="winner-item"
                key={winner.id}
              >
                <h3>{winner.match_type}</h3>

                <p>
                  Prize: ₹{winner.prize_amount}
                </p>

                <p>
                  Verification:{' '}
                  <strong>
                    {winner.verification_status}
                  </strong>
                </p>

                <p>
                  Payout:{' '}
                  <strong>
                    {winner.payout_status}
                  </strong>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No winnings yet.</p>
        )}
      </section>

      {/* Quick Actions */}
      <section className="dashboard-actions">

        <div className="dashboard-action-card">
          <div className="action-icon">
            ✓
          </div>

          <h3>Update Your Scores</h3>

          <p>
            Keep your latest five Stableford scores updated.
          </p>

          <button
            type="button"
            onClick={() => navigate('/scores')}
          >
            Manage Scores
          </button>
        </div>

        <div className="dashboard-action-card">
          <div className="action-icon">
            ♥
          </div>

          <h3>Support a Cause</h3>

          <p>
            Choose a charity and manage your contribution.
          </p>

          <button
            type="button"
            onClick={() => navigate('/charities')}
          >
            View Charities
          </button>
        </div>

        <div className="dashboard-action-card">
          <div className="action-icon">
            ✦
          </div>

          <h3>Monthly Draw</h3>

          <p>
            View published draws and prize information.
          </p>

          <button
            type="button"
            onClick={() => navigate('/draws')}
          >
            View Draws
          </button>
        </div>

      </section>
    </div>
  )
}

export default Dashboard