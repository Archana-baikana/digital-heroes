
const bcrypt = require('bcrypt')
const supabase = require('../db/database')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
  try {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const {data, error} = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          message: 'Email already exists',
        })
      }

      return res.status(500).json({
        message: error.message,
      })
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
        error: error.message,
    })
  }
}

module.exports = {
  signup,
}

const login = async (req, res) => {
  try {
    const {email, password} = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const {data: user, error} = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '1d',
  },
)
     res.status(200).json({
  message: 'Login successful',
    token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
})
  } catch (error) {
    console.error('LOGIN ERROR:', error)

    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}
module.exports = {
  signup,
 login , 
}