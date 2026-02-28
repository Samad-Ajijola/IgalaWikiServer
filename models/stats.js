const mongoose = require('mongoose')
const { Schema } = mongoose

const statsSchema = new Schema(
  {
    contributors: { type: String, default: '0' },
    articles: { type: String, default: '0' },
    mediaFiles: { type: String, default: '0' },
    events: { type: String, default: '0' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Stats', statsSchema)
