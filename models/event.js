const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema(
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

module.exports = mongoose.model('Event', eventSchema)
