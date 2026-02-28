require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const cors = require('./middlewares/cors')
const apiRoutes = require('./routes/index')

const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(cors)

// API routes (health, auth, events, projects, stats)
app.use('/api', apiRoutes)

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
