
import {useEffect, useState} from 'react'
import {Navigate} from 'react-router-dom'
import './SubscriptionRoute.css'
import API_URL from '../../services/api'

const SubscriptionRoute = ({children}) => {
  const [loading, setLoading] = useState(true)
  const [hasSubscription, setHasSubscription] = useState(false)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setLoading(false)
          return
        }

        const response = await 
        fetch(`${API_URL}/api/subscriptions/my`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()

          if (data.subscription) {
            setHasSubscription(true)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  if (loading) {
    return (
      <div className="subscription-check-container">
        <div className="subscription-check-card">
          <div className="subscription-loader"></div>

          <h2>Checking Subscription</h2>

          <p>Please wait...</p>
        </div>
      </div>
    )
  }

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />
  }

  if (!hasSubscription) {
    return <Navigate to="/subscription" replace />
  }

  return children
}

export default SubscriptionRoute