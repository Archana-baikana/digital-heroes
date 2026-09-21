
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const subscriptionRoutes = require('./routes/subscriptionRoutes')
const scoreRoutes = require('./routes/scoreRoutes')
const charityRoutes = require('./routes/charityRoutes')
const drawRoutes = require('./routes/drawRoutes')
const adminRoutes = require('./routes/adminRoutes')
const winnerRoutes = require('./routes/winnerRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/scores', scoreRoutes)
app.use('/api/charities', charityRoutes)
app.use('/api/draws', drawRoutes)
app.use('/api/admin', adminRoutes)
 app.use('/api/winners', winnerRoutes)
app.get('/', (req, res) => {
  res.json({
    message: 'Digital Heroes Backend is running',
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})