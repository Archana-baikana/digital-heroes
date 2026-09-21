
import {useEffect, useState} from 'react'
import API_URL from '../../services/api'
import './Draws.css'

const Draws = () => {
  const [draws, setDraws] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const fetchDraws = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/draws/published`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setDraws(data.draws || [])
      } else {
        setMessage(data.message || 'Unable to load draws')
      }
    } catch (error) {
      setMessage('Unable to load draws')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDraws()
  }, [])

  if (loading) {
    return (
      <div className="draws-page">
        <div className="draws-loading">
          Loading draws...
        </div>
      </div>
    )
  }

  return (
    <div className="draws-page">
      <div className="draws-container">

        <div className="draws-header">
          <p className="draws-label">
            MONTHLY DRAW
          </p>

          <h1>
            Your chance to
            <span> make a difference.</span>
          </h1>

          <p>
            Every month, eligible subscribers take part
            in our community draw. Match your scores and
            win a share of the prize pool.
          </p>
        </div>

        {message && (
          <div className="draw-message">
            {message}
          </div>
        )}

        {draws.length === 0 ? (
          <div className="no-draws">
            <div className="no-draws-icon">
              ✦
            </div>

            <h2>
              No published draws yet
            </h2>

            <p>
              The next monthly draw will appear here
              once it has been published.
            </p>
          </div>
        ) : (
          <div className="draws-list">

            {draws.map(draw => (
              <div
                className="draw-card"
                key={draw.id}
              >

                <div className="draw-card-top">

                  <div>
                    <p className="draw-number">
                      DRAW #{draw.id}
                    </p>

                    <h2>
                      Monthly Draw
                    </h2>
                  </div>

                  <span className="draw-status">
                    {draw.status}
                  </span>

                </div>

                <div className="draw-info">

                  <div className="draw-info-item">
                    <span>Draw Date</span>

                    <strong>
                      {new Date(
                        draw.draw_date,
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                  <div className="draw-info-item">
                    <span>Prize Pool</span>

                    <strong>
                      ₹
                      {Number(
                        draw.prize_pool || 0,
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div className="draw-info-item">
                    <span>Rollover</span>

                    <strong>
                      ₹
                      {Number(
                        draw.rollover_amount || 0,
                      ).toLocaleString()}
                    </strong>
                  </div>

                </div>

                <div className="match-section">

                  <h3>
                    Match your scores
                  </h3>

                  <div className="match-grid">

                    <div className="match-box">
                      <strong>5</strong>
                      <span>Match</span>
                      <small>40%</small>
                    </div>

                    <div className="match-box">
                      <strong>4</strong>
                      <span>Match</span>
                      <small>35%</small>
                    </div>

                    <div className="match-box">
                      <strong>3</strong>
                      <span>Match</span>
                      <small>25%</small>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

        <div className="draw-rules">

          <p className="draws-label">
            HOW IT WORKS
          </p>

          <h2>
            Simple. Monthly. Community driven.
          </h2>

          <div className="rules-grid">

            <div className="rule-card">
              <span>01</span>

              <h3>
                Enter your scores
              </h3>

              <p>
                Keep your latest five Stableford scores
                updated in your account.
              </p>
            </div>

            <div className="rule-card">
              <span>02</span>

              <h3>
                Monthly draw
              </h3>

              <p>
                Five numbers are randomly selected from
                the available score range.
              </p>
            </div>

            <div className="rule-card">
              <span>03</span>

              <h3>
                Match & win
              </h3>

              <p>
                Match 3, 4 or 5 numbers to receive a share
                of the available prize pool.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Draws