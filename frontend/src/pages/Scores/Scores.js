
import {useEffect, useState} from 'react'
import API_URL from '../../services/api'

import './Scores.css'

const Scores = () => {
  const [scores, setScores] = useState([])
  const [score, setScore] = useState('')
  const [scoreDate, setScoreDate] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Get user's scores
  const fetchScores = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/api/scores/my`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setScores(data.scores || [])
      } else {
        setMessage(data.message || 'Unable to load scores')
      }
    } catch (error) {
      setMessage('Unable to load scores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [])

  // Add score
  const handleSubmit = async event => {
    event.preventDefault()

    if (!score || !scoreDate) {
      setMessage('Please enter score and date')
      return
    }

    if (Number(score) < 1 || Number(score) > 45) {
      setMessage('Score must be between 1 and 45')
      return
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/api/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: Number(score),
          score_date: scoreDate,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Score added successfully')
        setScore('')
        setScoreDate('')
        fetchScores()
      } else {
        setMessage(data.message || 'Unable to save score')
      }
    } catch (error) {
      setMessage('Unable to save score')
    }
  }

  // Delete score
  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/api/scores/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Score deleted successfully')
        fetchScores()
      } else {
        setMessage(data.message || 'Unable to delete score')
      }
    } catch (error) {
      setMessage('Unable to delete score')
    }
  }

  if (loading) {
    return (
      <div className="scores-page">
        <div className="scores-loading">
          Loading your scores...
        </div>
      </div>
    )
  }

  return (
    <div className="scores-page">
      <div className="scores-container">

        <div className="scores-header">
          <p className="scores-label">YOUR SCORES</p>

          <h1>
            Keep your latest
            <span> Stableford scores.</span>
          </h1>

          <p>
            Add your recent scores to participate in the
            monthly Digital Heroes draw.
          </p>
        </div>

        {message && (
          <div className="scores-message">
            {message}
          </div>
        )}

        <div className="scores-layout">

          {/* ADD SCORE */}

          <section className="score-form-card">

            <h2>Add Score</h2>

            <p>
              Enter a Stableford score between 1 and 45.
            </p>

            <form onSubmit={handleSubmit}>

              <label htmlFor="score">
                Stableford Score
              </label>

              <input
                id="score"
                type="number"
                min="1"
                max="45"
                value={score}
                onChange={event => setScore(event.target.value)}
                placeholder="Example: 32"
              />

              <label htmlFor="scoreDate">
                Score Date
              </label>

              <input
                id="scoreDate"
                type="date"
                value={scoreDate}
                onChange={event => setScoreDate(event.target.value)}
              />

              <button type="submit">
                Add Score
              </button>

            </form>

          </section>

          {/* SCORE LIST */}

          <section className="score-list-card">

            <div className="score-list-header">
              <div>
                <p>LATEST SCORES</p>
                <h2>Your Score History</h2>
              </div>

              <span>
                {scores.length}/5
              </span>
            </div>

            {scores.length === 0 ? (
              <div className="empty-scores">
                <h3>No scores yet</h3>

                <p>
                  Add your first Stableford score to get started.
                </p>
              </div>
            ) : (
              <div className="scores-list">

                {scores.map((item, index) => (
                  <div
                    className="score-item"
                    key={item.id}
                  >

                    <div className="score-number">
                      {item.score}
                    </div>

                    <div className="score-info">
                      <strong>
                        Stableford Score
                      </strong>

                      <span>
                        {new Date(
                          item.score_date,
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="score-position">
                      #{index + 1}
                    </div>

                    <button
                      type="button"
                      className="delete-score"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>

                  </div>
                ))}

              </div>
            )}

          </section>

        </div>

        <div className="score-info-box">
          <strong>How your 5 scores work</strong>

          <p>
            Digital Heroes keeps your latest five scores.
            When you add a sixth score, your oldest score
            is automatically removed.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Scores