const User = require('../models/user')
const bcrypt = require('bcrypt')

const authCtrl = {
  hasAdmin: async (req, res) => {
    try {
      const count = await User.countDocuments()
      res.json({ hasAdmin: count > 0 })
    } catch (err) {
      console.error('Failed to check admin user', err)
      res.status(500).json({ error: 'Failed to check admin user' })
    }
  },

  register: async (req, res) => {
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
  },

  login: async (req, res) => {
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
  },

  changePassword: async (req, res) => {
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
  },
}

module.exports = authCtrl
