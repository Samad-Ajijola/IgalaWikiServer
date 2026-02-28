const router = require('express').Router()
const statsCtrl = require('../controllers/statsCtrl')

router.get('/', statsCtrl.get)
router.put('/', statsCtrl.update)

module.exports = router
