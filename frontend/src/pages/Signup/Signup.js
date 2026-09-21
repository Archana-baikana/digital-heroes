
 import {useState} from 'react'
import './Signup.css'
const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const response = await fetch(
      'http://localhost:3001/api/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      },
    )

    const data = await response.json()

    if (response.ok) {
      setMessage('Account created successfully!')
      setName('')
      setEmail('')
      setPassword('')
    } else {
      setMessage(data.message)
    }
  }

   return (
  <div className="signup-container">
    <form className="signup-form" onSubmit={handleSubmit}>
      <h1>Create Account</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={event => setName(event.target.value)}
      />

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

      <button type="submit">Sign Up</button>

      <p>{message}</p>
    </form>
  </div>
)
}

export default Signup