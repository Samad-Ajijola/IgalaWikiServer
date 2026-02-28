const cors = require('cors')

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}

module.exports = cors(corsOptions)
