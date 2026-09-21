
const express = require('express')

const {
  getUsers,
  getAllWinners,
  approveWinner,
  rejectWinner,
  markWinnerPaid,
} = require('../controllers/adminController')

const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router()

// Get all users
router.get(
  '/users',
  authMiddleware,
  adminMiddleware,
  getUsers
)

// Get all winners
router.get(
  '/winners',
  authMiddleware,
  adminMiddleware,
  getAllWinners
)

// Approve winner
router.put(
  '/winners/:id/approve',
  authMiddleware,
  adminMiddleware,
  approveWinner
)

// Reject winner
router.put(
  '/winners/:id/reject',
  authMiddleware,
  adminMiddleware,
  rejectWinner
)

// Mark winner as paid
router.put(
  '/winners/:id/pay',
  authMiddleware,
  adminMiddleware,
  markWinnerPaid
)

module.exports = router