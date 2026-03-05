const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    imageSrc: { type: String, default: '' }, // Cloudinary URL for main image
    imageKey: { type: String, default: '' }, // Cloudinary public_id
    galleryImages: { type: [String], default: [] }, // Cloudinary URLs
  },
  { timestamps: true },
);

eventSchema.index({ createdAt: -1 }); // optional

module.exports = mongoose.model('Event', eventSchema);