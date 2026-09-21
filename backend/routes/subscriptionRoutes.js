
const express = require('express')

const {
  createSubscription,
  getMySubscription,
} = require('../controllers/subscriptionController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createSubscription)

router.get('/my', authMiddleware, getMySubscription)

module.exports = router