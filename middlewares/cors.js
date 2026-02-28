const cors = require('cors')

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' || "https://igala-wikimedia.vercel.app/",
  credentials: true,
}

module.exports = cors(corsOptions)
