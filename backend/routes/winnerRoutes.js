
const express = require('express')

const {
  getMyWinners,
  submitProof,
} = require('../controllers/winnerController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/my', authMiddleware, getMyWinners)

router.put(
  '/:id/proof',
  authMiddleware,
  submitProof,
)

module.exports = router