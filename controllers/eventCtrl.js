const Event = require('../models/event')
const mongoose = require('mongoose')

function parseEventId(paramId) {
  const num = Number(paramId)
  if (!Number.isNaN(num) && Number.isInteger(num)) return { id: num }
  if (mongoose.Types.ObjectId.isValid(paramId) && String(paramId).length === 24) {
    return { _id: new mongoose.Types.ObjectId(paramId) }
  }
  return null
}

const eventCtrl = {
  getAll: async (req, res) => {
    try {
      const events = await Event.find().sort({ createdAt: -1 }).lean()
      res.json(events)
    } catch (err) {
      console.error('Failed to fetch events', err)
      res.status(500).json({ error: 'Failed to fetch events' })
    }
  },

  getById: async (req, res) => {
    const filter = parseEventId(req.params.id)
    if (!filter) {
      return res.status(400).json({ error: 'Invalid event id' })
    }
    try {
      const event = await Event.findOne(filter).lean()
      if (!event) return res.status(404).json({ error: 'Event not found' })
      res.json(event)
    } catch (err) {
      console.error('Failed to fetch event', err)
      res.status(500).json({ error: 'Failed to fetch event' })
    }
  },

  createEvent: async (req, res) => {
    const { name, description, imageSrc, galleryImages } = req.body
    if (!name) {
      return res.status(400).json({ error: 'name is required' })
    }
    try {
      const event = await Event.create({
        id: Date.now(),
        name,
        description: description || '',
        imageSrc: imageSrc || '',
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      })
      res.status(201).json(event)
    } catch (err) {
      console.error('Failed to create event', err)
      res.status(500).json({ error: 'Failed to create event' })
    }
  },

  update: async (req, res) => {
    const filter = parseEventId(req.params.id)
    if (!filter) {
      return res.status(400).json({ error: 'Invalid event id' })
    }
    const { name, description, imageSrc, galleryImages } = req.body
    try {
      const existing = await Event.findOne(filter)
      if (!existing) return res.status(404).json({ error: 'Event not found' })

      if (name !== undefined) existing.name = name
      if (description !== undefined) existing.description = description
      if (imageSrc !== undefined) existing.imageSrc = imageSrc
      if (galleryImages !== undefined && Array.isArray(galleryImages)) {
        existing.galleryImages = galleryImages
      }

      const updated = await existing.save()
      res.json(updated)
    } catch (err) {
      console.error('Failed to update event', err)
      res.status(500).json({ error: 'Failed to update event' })
    }
  },

  delete: async (req, res) => {
    const filter = parseEventId(req.params.id)
    if (!filter) {
      return res.status(400).json({ error: 'Invalid event id' })
    }
    try {
      const result = await Event.deleteOne(filter)
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Event not found' })
      }
      res.status(204).send()
    } catch (err) {
      console.error('Failed to delete event', err)
      res.status(500).json({ error: 'Failed to delete event' })
    }
  },
}

module.exports = eventCtrl
