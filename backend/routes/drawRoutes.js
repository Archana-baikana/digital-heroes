
const express = require('express')
 
const {
  simulateDraw,
  createDraw,
   runDraw,
    publishDraw,
    getPublishedDraws
} = require('../controllers/drawController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/simulate', authMiddleware, simulateDraw)
router.post('/create', authMiddleware, createDraw)
router.post('/run', authMiddleware, runDraw)
router.put('/:id/publish', authMiddleware, publishDraw,)
router.get('/published', authMiddleware, getPublishedDraws)
module.exports = router