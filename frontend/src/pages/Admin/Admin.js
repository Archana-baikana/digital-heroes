
import {useEffect, useState} from 'react'
import API_URL from '../../services/api'

import './Admin.css'

const Admin = () => {
  const [users, setUsers] = useState([])
  const [winners, setWinners] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const [drawId, setDrawId] = useState('')
  const [prizePool, setPrizePool] = useState(10000)
  const [drawMessage, setDrawMessage] = useState('')
  const [drawLoading, setDrawLoading] = useState(false)

  const createDraw = async () => {
    try {
      setDrawLoading(true)
      setDrawMessage('Creating draw...')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/draws/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prize_pool: Number(prizePool),
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setDrawId(data.draw.id)
        setDrawMessage(
          `Draw #${data.draw.id} created successfully.`,
        )
      } else {
        setDrawMessage(data.message || 'Unable to create draw')
      }
    } catch (error) {
      setDrawMessage('Unable to create draw')
    } finally {
      setDrawLoading(false)
    }
  }

  const simulateDraw = async () => {
    try {
      setDrawLoading(true)
      setDrawMessage('Simulating draw...')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/draws/simulate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setDrawMessage(
          `Winning numbers: ${data.winningNumbers.join(', ')}`,
        )
      } else {
        setDrawMessage(
          data.message || 'Unable to simulate draw',
        )
      }
    } catch (error) {
      setDrawMessage('Unable to simulate draw')
    } finally {
      setDrawLoading(false)
    }
  }

  const runDraw = async () => {
    if (!drawId) {
      setDrawMessage('Create a draw first.')
      return
    }

    try {
      setDrawLoading(true)
      setDrawMessage('Running draw...')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/draws/run`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            draw_id: Number(drawId),
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setDrawMessage(
          `Draw completed. Winners found: ${
            data.winners?.length || 0
          }`,
        )
      } else {
        setDrawMessage(
          data.message || 'Unable to run draw',
        )
      }
    } catch (error) {
      setDrawMessage('Unable to run draw')
    } finally {
      setDrawLoading(false)
    }
  }

  const publishDraw = async () => {
    if (!drawId) {
      setDrawMessage('Create a draw first.')
      return
    }

    try {
      setDrawLoading(true)
      setDrawMessage('Publishing draw...')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/draws/${drawId}/publish`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setDrawMessage(
          `Draw #${drawId} published successfully.`,
        )
      } else {
        setDrawMessage(
          data.message || 'Unable to publish draw',
        )
      }
    } catch (error) {
      setDrawMessage('Unable to publish draw')
    } finally {
      setDrawLoading(false)
    }
  }

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token')

      const usersResponse = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const usersData = await usersResponse.json()

      if (usersResponse.ok) {
        setUsers(usersData.users || [])
      } else {
        setMessage(
          usersData.message || 'Unable to load users',
        )
      }

      const winnersResponse = await fetch(
        `${API_URL}/api/admin/winners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const winnersData = await winnersResponse.json()

      if (winnersResponse.ok) {
        setWinners(winnersData.winners || [])
      } else {
        setMessage(
          winnersData.message || 'Unable to load winners',
        )
      }
    } catch (error) {
      setMessage('Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const updateWinner = async (id, action) => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/admin/winners/${id}/${action}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        fetchAdminData()
      } else {
        setMessage(
          data.message || 'Unable to update winner',
        )
      }
    } catch (error) {
      setMessage('Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          Loading Admin Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <p className="admin-label">ADMIN PANEL</p>

            <h1>Digital Heroes Dashboard</h1>

            <p>
              Manage users, winners and prize verification.
            </p>
          </div>
        </div>

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}

        {/* STATS */}

        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Winners</span>
            <strong>{winners.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending Verification</span>

            <strong>
              {
                winners.filter(
                  winner =>
                    winner.verification_status === 'pending',
                ).length
              }
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>Paid Winners</span>

            <strong>
              {
                winners.filter(
                  winner =>
                    winner.payout_status === 'paid',
                ).length
              }
            </strong>
          </div>

        </div>

        {/* USERS */}

        <section className="admin-section">

          <div className="section-heading">
            <h2>Registered Users</h2>

            <span>
              {users.length} users
            </span>
          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>

                {users.map(user => (
                  <tr key={user.id}>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        user.created_at,
                      ).toLocaleDateString()}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

        {/* DRAW MANAGEMENT */}

        <div className="admin-draw-section">

          <div className="admin-section-heading">

            <p>DRAW MANAGEMENT</p>

            <h2>Monthly Draw</h2>

            <span>
              Create, run and publish the monthly community draw.
            </span>

          </div>

          <div className="draw-controls">

            <div className="draw-input-group">

              <label htmlFor="prizePool">
                Prize Pool
              </label>

              <input
                id="prizePool"
                type="number"
                min="0"
                value={prizePool}
                onChange={event =>
                  setPrizePool(event.target.value)
                }
              />

            </div>

            <div className="draw-input-group">

              <label htmlFor="drawId">
                Draw ID
              </label>

              <input
                id="drawId"
                type="number"
                value={drawId}
                onChange={event =>
                  setDrawId(event.target.value)
                }
                placeholder="Created automatically"
              />

            </div>

          </div>

          <div className="draw-actions">

            <button
              type="button"
              onClick={createDraw}
              disabled={drawLoading}
            >
              Create Draw
            </button>

            <button
              type="button"
              onClick={simulateDraw}
              disabled={drawLoading}
            >
              Simulate
            </button>

            <button
              type="button"
              onClick={runDraw}
              disabled={drawLoading}
            >
              Run Draw
            </button>

            <button
              type="button"
              onClick={publishDraw}
              disabled={drawLoading}
            >
              Publish Draw
            </button>

          </div>

          {drawMessage && (
            <div className="draw-admin-message">
              {drawMessage}
            </div>
          )}

        </div>

        {/* WINNERS */}

        <section className="admin-section">

          <div className="section-heading">

            <h2>Winner Verification</h2>

            <span>
              {winners.length} winners
            </span>

          </div>

          {winners.length === 0 ? (

            <div className="empty-admin">
              No winners available.
            </div>

          ) : (

            <div className="winner-admin-grid">

              {winners.map(winner => (

                <div
                  className="winner-admin-card"
                  key={winner.id}
                >

                  <div className="winner-card-top">

                    <div>

                      <h3>
                        {winner.users?.name || 'Unknown User'}
                      </h3>

                      <p>
                        {winner.users?.email || 'No email'}
                      </p>

                    </div>

                    <span className="match-badge">
                      {winner.match_type}
                    </span>

                  </div>

                  <div className="winner-details">

                    <div>
                      <span>Prize</span>

                      <strong>
                        ₹{winner.prize_amount}
                      </strong>
                    </div>

                    <div>
                      <span>Draw Date</span>

                      <strong>
                        {winner.draws?.draw_date || '-'}
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
                      View Proof
                    </a>

                  )}

                  <div className="winner-actions">

                    {winner.verification_status ===
                      'pending' && (

                      <>

                        <button
                          className="approve-btn"
                          onClick={() =>
                            updateWinner(
                              winner.id,
                              'approve',
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateWinner(
                              winner.id,
                              'reject',
                            )
                          }
                        >
                          Reject
                        </button>

                      </>

                    )}

                    {winner.verification_status ===
                      'approved' &&
                      winner.payout_status !== 'paid' && (

                      <button
                        className="pay-btn"
                        onClick={() =>
                          updateWinner(
                            winner.id,
                            'pay',
                          )
                        }
                      >
                        Mark as Paid
                      </button>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>
    </div>
  )
}

export default Admin