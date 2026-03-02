const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    imageSrc: { type: String, default: '' },
    imageKey: { type: String, default: '' },
    galleryImages: { type: [String], default: [] },
  },
  { timestamps: true },
)

eventSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Event', eventSchema)
