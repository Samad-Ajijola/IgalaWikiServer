const Stats = require('../models/stats')

const statsCtrl = {
  get: async (req, res) => {
    try {
      let stats = await Stats.findOne().lean()
      if (!stats) {
        const created = await Stats.create({})
        stats = created.toObject()
      }
      res.json(stats)
    } catch (err) {
      console.error('Failed to fetch stats', err)
      res.status(500).json({ error: 'Failed to fetch stats' })
    }
  },

  update: async (req, res) => {
    const { contributors, articles, mediaFiles, events: eventsCount } = req.body
    try {
      const updated = await Stats.findOneAndUpdate(
        {},
        {
          ...(contributors !== undefined ? { contributors } : {}),
          ...(articles !== undefined ? { articles } : {}),
          ...(mediaFiles !== undefined ? { mediaFiles } : {}),
          ...(eventsCount !== undefined ? { events: eventsCount } : {}),
        },
        { new: true, upsert: true },
      )
      res.json(updated)
    } catch (err) {
      console.error('Failed to update stats', err)
      res.status(500).json({ error: 'Failed to update stats' })
    }
  },
}

module.exports = statsCtrl
