
const express = require('express')

const {
  getCharities,
  selectCharity,
  getMyCharity,
} = require('../controllers/charityController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getCharities)

router.post('/select', authMiddleware, selectCharity)

router.get('/my', authMiddleware, getMyCharity)

module.exports = router