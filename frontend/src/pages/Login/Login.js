
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import API_URL from '../../services/api'
import './Login.css'

const Login = () => {
    const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const response = await  fetch(`${API_URL}/api/auth/login`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    )

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setMessage('Login successful!')
       navigate('/dashboard')
      console.log('TOKEN:', data.token)
    } else {
      setMessage(data.message)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <button type="submit">Login</button>

        <p>{message}</p>
      </form>
    </div>
  )
}

export default Login