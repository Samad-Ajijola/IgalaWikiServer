const Project = require('../models/project')

const projectCtrl = {
  getAll: async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 }).lean()
      res.json(projects)
    } catch (err) {
      console.error('Failed to fetch projects', err)
      res.status(500).json({ error: 'Failed to fetch projects' })
    }
  },

  create: async (req, res) => {
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
  },

  update: async (req, res) => {
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
  },

  delete: async (req, res) => {
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
  },
}

module.exports = projectCtrl
