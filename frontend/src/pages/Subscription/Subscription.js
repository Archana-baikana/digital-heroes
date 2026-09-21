
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import API_URL from '../../services/api'
import './Subscription.css'

const Subscription = () => {
    const [selectedPlan ] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
   
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(`${API_URL}/api/subscriptions/my`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

   const handleSubscribe = async plan => {
  try {
    setMessage('Processing subscription...')

    const token = localStorage.getItem('token')

    const response = await  fetch(`${API_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan,
        }),
      },
    )

    const data = await response.json()

    if (response.ok) {
      setMessage('Subscription activated successfully!')

      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } else {
      setMessage(data.message || 'Subscription failed')
    }
  } catch (error) {
    console.error(error)
    setMessage('Unable to process subscription')
  }
}

  if (loading) {
    return (
      <div className="subscription-loading">
        Checking subscription...
      </div>
    )
  }

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h1>Choose Your Subscription</h1>
        <p>Support great causes while participating in Digital Heroes.</p>
      </div>

      {subscription && (
        <div className="active-subscription">
          <h2>Active Subscription</h2>

          <p>
            <strong>Plan:</strong> {subscription.plan}
          </p>

          <p>
            <strong>Amount:</strong> ₹{subscription.amount}
          </p>

          <p>
            <strong>Status:</strong> {subscription.status}
          </p>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="dashboard-button"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {message && (
        <p className="subscription-message">
          {message}
        </p>
      )}

      {!subscription && (
        <div className="subscription-plans">
          <div className="subscription-card">
            <h2>Monthly</h2>

            <p className="subscription-price">
              ₹499
            </p>

            <p>Monthly Digital Heroes membership</p>

            <button
              type="button"
              onClick={() => handleSubscribe('monthly')}
              disabled={selectedPlan !== ''}
            >
              {selectedPlan === 'monthly'
                ? 'Activating...'
                : 'Subscribe Monthly'}
            </button>
          </div>

          <div className="subscription-card">
            <h2>Yearly</h2>

            <p className="subscription-price">
              ₹4999
            </p>

            <p>Yearly Digital Heroes membership</p>

            <button
              type="button"
              onClick={() => handleSubscribe('yearly')}
              disabled={selectedPlan !== ''}
            >
              {selectedPlan === 'yearly'
                ? 'Activating...'
                : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscription