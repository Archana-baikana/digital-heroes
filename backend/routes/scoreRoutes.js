
const express = require('express')

const {
  addScore,
  getMyScores,
  deleteScore,
} = require('../controllers/scoreController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, addScore)

router.get('/my', authMiddleware, getMyScores)

router.delete('/:id', authMiddleware, deleteScore)

module.exports = router