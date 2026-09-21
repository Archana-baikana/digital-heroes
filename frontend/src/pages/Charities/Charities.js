
import {useEffect, useState} from 'react'
import API_URL from '../../services/api'
import './Charities.css'

const Charities = () => {
  const [charities, setCharities] = useState([])
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [percentage, setPercentage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [showDetails, setShowDetails] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCharities = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `${API_URL}/api/charities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok) {
        setCharities(data.charities || [])
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('Unable to load charities')
    }
  }

  const fetchMyCharity = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
         `${API_URL}/api/charities/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (response.ok && data.charity) {
        setSelectedCharity(data.charity)
        setPercentage(data.charity.percentage)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharities()
    fetchMyCharity()
  }, [])

  const handleSelectCharity = async charityId => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:3001/api/charities/select',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            charity_id: charityId,
            percentage: Number(percentage),
          }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        setMessage('Charity selected successfully!')
        fetchMyCharity()
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('Unable to select charity')
    }
  }

  if (loading) {
    return (
      <div className="charities-page">
        <div className="charities-loading">
          Loading charities...
        </div>
      </div>
    )
  }

  const filteredCharities = charities.filter(charity =>
    charity.name
      .toLowerCase()
      .includes(searchInput.toLowerCase()),
  )

  const featuredCharities = filteredCharities.filter(
    charity => charity.featured,
  )

  return (
    <div className="charities-page">
      <div className="charities-container">

        {/* HEADER */}

        <div className="charities-header">
          <p className="charities-label">
            MAKE AN IMPACT
          </p>

          <h1>
            Choose a cause
            <span> you care about.</span>
          </h1>

          <p>
            Select a charity and decide how much of your
            subscription contribution you would like to support.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="charity-message">
            {message}
          </div>
        )}

        {/* SEARCH */}

        <div className="charity-search">
          <input
            type="search"
            placeholder="Search charities..."
            value={searchInput}
            onChange={event =>
              setSearchInput(event.target.value)
            }
          />
        </div>

        {/* CURRENT CHARITY */}

        {selectedCharity && (
          <div className="selected-charity">
            <div>
              <p>YOUR CURRENT CHARITY</p>

              <h2>
                {selectedCharity.charities?.name}
              </h2>

              <span>
                Contribution: {selectedCharity.percentage}%
              </span>
            </div>

            <div className="selected-icon">
              ✓
            </div>
          </div>
        )}

        {/* CONTRIBUTION */}

        <div className="contribution-box">
          <div>
            <h3>Your Contribution</h3>

            <p>
              Choose the percentage you want to contribute.
              Minimum contribution is 10%.
            </p>
          </div>

          <div className="percentage-control">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={percentage}
              onChange={event =>
                setPercentage(event.target.value)
              }
            />

            <strong>{percentage}%</strong>
          </div>
        </div>

        {/* FEATURED */}

        {featuredCharities.length > 0 && (
          <section className="featured-section">
            <div className="section-heading">
              <p>FEATURED</p>
              <h2>Causes making a difference</h2>
            </div>

            <div className="charities-grid">
              {featuredCharities.map(charity => (
                <div
                  className="charity-card featured-card"
                  key={charity.id}
                >
                  <div className="featured-badge">
                    Featured
                  </div>

                  <div className="charity-image">
                    <span>✦</span>
                  </div>

                  <div className="charity-card-content">
                    <h2>{charity.name}</h2>

                    <p>
                      {charity.description}
                    </p>

                    <div className="charity-actions">
                      <button
                        type="button"
                        onClick={() =>
                          setShowDetails(charity)
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSelectCharity(charity.id)
                        }
                      >
                        {selectedCharity?.charity_id ===
                        charity.id
                          ? 'Selected'
                          : 'Choose This Charity'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ALL CHARITIES */}

        <section className="all-charities-section">
          <div className="section-heading">
            <p>OUR CHARITIES</p>
            <h2>Choose your cause</h2>
          </div>

          {filteredCharities.length === 0 ? (
            <div className="empty-charities">
              No charities found.
            </div>
          ) : (
            <div className="charities-grid">
              {filteredCharities.map(charity => (
                <div
                  className="charity-card"
                  key={charity.id}
                >
                  <div className="charity-image">
                    <span>✦</span>
                  </div>

                  <div className="charity-card-content">
                    <h2>{charity.name}</h2>

                    <p>
                      {charity.description}
                    </p>

                    <div className="charity-actions">
                      <button
                        type="button"
                        onClick={() =>
                          setShowDetails(charity)
                        }
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSelectCharity(charity.id)
                        }
                      >
                        {selectedCharity?.charity_id ===
                        charity.id
                          ? 'Selected'
                          : 'Choose This Charity'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* DETAILS */}

        {showDetails && (
          <div className="charity-modal">
            <div className="charity-modal-content">

              <button
                type="button"
                className="close-modal"
                onClick={() => setShowDetails(null)}
              >
                ×
              </button>

              <p className="charities-label">
                CHARITY PROFILE
              </p>

              <h2>{showDetails.name}</h2>

              <p>
                {showDetails.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  handleSelectCharity(showDetails.id)
                  setShowDetails(null)
                }}
              >
                Support This Charity
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Charities