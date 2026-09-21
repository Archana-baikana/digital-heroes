
import {useEffect, useState} from 'react'
import API_URL from '../../services/api'
import './Winners.css'

const Winners = () => {
  const [winners, setWinners] = useState([])
  const [proofUrls, setProofUrls] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchWinners = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/winners/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setWinners(data.winners || [])
      } else {
        setMessage(data.message || 'Unable to load winners')
      }
    } catch (error) {
      setMessage('Unable to load winners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  const handleProofChange = (id, value) => {
    setProofUrls(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  const submitProof = async id => {
    const proofUrl = proofUrls[id]

    if (!proofUrl) {
      setMessage('Please enter your proof URL.')
      return
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/winners/${id}/proof`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            proof_url: proofUrl,
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Proof submitted successfully.')
        fetchWinners()
      } else {
        setMessage(data.message || 'Unable to submit proof.')
      }
    } catch (error) {
      setMessage('Unable to submit proof.')
    }
  }

  if (loading) {
    return (
      <div className="winners-page">
        <div className="winners-loading">
          Loading winners...
        </div>
      </div>
    )
  }

  return (
    <div className="winners-page">
      <div className="winners-container">

        <div className="winners-header">
          <p className="winners-label">
            YOUR RESULTS
          </p>

          <h1>
            Winners
            <span> & payouts.</span>
          </h1>

          <p>
            View your winning entries, submit proof,
            and track your verification and payout status.
          </p>
        </div>

        {message && (
          <div className="winner-message">
            {message}
          </div>
        )}

        {winners.length === 0 ? (
          <div className="no-winners">
            <div className="no-winners-icon">
              ✦
            </div>

            <h2>
              No winning entries yet
            </h2>

            <p>
              Your winning entries will appear here
              after a monthly draw.
            </p>
          </div>
        ) : (
          <div className="winners-list">

            {winners.map(winner => (
              <div
                className="winner-card"
                key={winner.id}
              >

                <div className="winner-card-header">

                  <div>
                    <p>
                      DRAW #
                      {winner.draw_id}
                    </p>

                    <h2>
                      {winner.match_type}
                    </h2>
                  </div>

                  <div className="winner-prize">
                    ₹
                    {Number(
                      winner.prize_amount || 0,
                    ).toLocaleString()}
                  </div>

                </div>

                <div className="winner-details">

                  <div>
                    <span>Draw Date</span>

                    <strong>
                      {winner.draws?.draw_date
                        ? new Date(
                            winner.draws.draw_date,
                          ).toLocaleDateString()
                        : '-'}
                    </strong>
                  </div>

                  <div>
                    <span>Verification</span>

                    <strong>
                      {winner.verification_status}
                    </strong>
                  </div>

                  <div>
                    <span>Payout</span>

                    <strong>
                      {winner.payout_status}
                    </strong>
                  </div>

                </div>

                {winner.proof_url && (
                  <a
                    href={winner.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="proof-link"
                  >
                    View Submitted Proof
                  </a>
                )}

                {winner.verification_status !== 'approved' &&
                  winner.payout_status !== 'paid' && (
                    <div className="proof-form">

                      <input
                        type="url"
                        placeholder="Enter proof URL"
                        value={
                          proofUrls[winner.id] || ''
                        }
                        onChange={event =>
                          handleProofChange(
                            winner.id,
                            event.target.value,
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          submitProof(winner.id)
                        }
                      >
                        Submit Proof
                      </button>

                    </div>
                  )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default Winners