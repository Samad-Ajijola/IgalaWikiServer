const mongoose = require('mongoose')
const { Schema } = mongoose

const projectSchema = new Schema(
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

module.exports = mongoose.model('Project', projectSchema)
