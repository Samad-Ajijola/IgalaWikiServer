require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')

// Models
const User = require('./models/user')

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
)

// Existing simple auth routes (register/login) – kept for compatibility
app.use('/', require('./routes/routes'))

// Additional schemas for events, projects, and stats
const eventSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    imageSrc: { type: String, default: '' },
    imageKey: { type: String, default: '' },
    galleryImages: { type: [String], default: [] },
  },
  { timestamps: true },
)

const projectSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '📚' },
    href: { type: String, default: '' },
    color: { type: String, default: 'from-blue-500 to-cyan-500' },
  },
  { timestamps: true },
)

const statsSchema = new mongoose.Schema(
  {
    contributors: { type: String, default: '0' },
    articles: { type: String, default: '0' },
    mediaFiles: { type: String, default: '0' },
    events: { type: String, default: '0' },
  },
  { timestamps: true },
)

const Event = mongoose.model('Event', eventSchema)
const Project = mongoose.model('Project', projectSchema)
const Stats = mongoose.model('Stats', statsSchema)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

// Auth helpers using User model as admin
// Check if an admin account already exists
app.get('/api/auth/has-admin', async (req, res) => {
  try {
    const count = await User.countDocuments()
    res.json({ hasAdmin: count > 0 })
  } catch (err) {
    console.error('Failed to check admin user', err)
    res.status(500).json({ error: 'Failed to check admin user' })
  }
})

// Register initial admin (only allowed when no admin exists)
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }
  try {
    const count = await User.countDocuments()
    if (count > 0) {
      return res.status(400).json({ error: 'Admin already exists' })
    }
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const user = await User.create({ username, password: passwordHash })
    res.status(201).json({ username: user.username })
  } catch (err) {
    console.error('Failed to register admin', err)
    res.status(500).json({ error: 'Failed to register admin' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    res.json({ username: user.username })
  } catch (err) {
    console.error('Failed to login', err)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// Change password
app.post('/api/auth/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body || {}
  if (!username || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: 'username, currentPassword and newPassword are required' })
  }
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()
    res.json({ username: user.username })
  } catch (err) {
    console.error('Failed to change password', err)
    res.status(500).json({ error: 'Failed to change password' })
  }
})

// Events CRUD
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean()
    res.json(events)
  } catch (err) {
    console.error('Failed to fetch events', err)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

app.post('/api/events', async (req, res) => {
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
})

app.put('/api/events/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, description, imageSrc, galleryImages } = req.body

  try {
    const existing = await Event.findOne({ id })
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
})

app.delete('/api/events/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const result = await Event.deleteOne({ id })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }
    res.status(204).send()
  } catch (err) {
    console.error('Failed to delete event', err)
    res.status(500).json({ error: 'Failed to delete event' })
  }
})

app.get('/api/events/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const event = await Event.findOne({ id }).lean()
    if (!event) return res.status(404).json({ error: 'Event not found' })
    res.json(event)
  } catch (err) {
    console.error('Failed to fetch event', err)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    res.json(projects)
  } catch (err) {
    console.error('Failed to fetch projects', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

app.post('/api/projects', async (req, res) => {
  const { name, description, icon, href, color } = req.body
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }
  try {
    const project = await Project.create({
      id: Date.now(),
      name,
      description: description || '',
      icon: icon || '📚',
      href: href || '',
      color: color || 'from-blue-500 to-cyan-500',
    })
    res.status(201).json(project)
  } catch (err) {
    console.error('Failed to create project', err)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

app.put('/api/projects/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, description, icon, href, color } = req.body

  try {
    const existing = await Project.findOne({ id })
    if (!existing) return res.status(404).json({ error: 'Project not found' })

    if (name !== undefined) existing.name = name
    if (description !== undefined) existing.description = description
    if (icon !== undefined) existing.icon = icon
    if (href !== undefined) existing.href = href
    if (color !== undefined) existing.color = color

    const updated = await existing.save()
    res.json(updated)
  } catch (err) {
    console.error('Failed to update project', err)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

app.delete('/api/projects/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const result = await Project.deleteOne({ id })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.status(204).send()
  } catch (err) {
    console.error('Failed to delete project', err)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

// Stats (single document)
app.get('/api/stats', async (req, res) => {
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
})

app.put('/api/stats', async (req, res) => {
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
})

// Connect to MongoDB, then start server
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('connected Successfully')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  connect()
  console.log(`server is running on ${PORT}`)
})