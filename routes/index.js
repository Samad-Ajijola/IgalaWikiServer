const express = require('express')
const authRoutes = require('./authRoutes')
const eventRoutes = require('./eventRoutes')
const projectRoutes = require('./projectRoutes')
const statsRoutes = require('./statsRoutes')

const router = express.Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

router.use('/auth', authRoutes)
router.use('/events', eventRoutes)
router.use('/projects', projectRoutes)
router.use('/stats', statsRoutes)

module.exports = router
