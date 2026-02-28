const router = require('express').Router()
const authCtrl = require('../controllers/authCtrl')

router.get('/has-admin', authCtrl.hasAdmin)
router.post('/register', authCtrl.register)
router.post('/login', authCtrl.login)
router.post('/change-password', authCtrl.changePassword)

module.exports = router
