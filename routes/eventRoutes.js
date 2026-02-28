const router = require('express').Router()
const eventCtrl = require('../controllers/eventCtrl')

router.get('/', eventCtrl.getAll)
router.get('/:id', eventCtrl.getById)
router.post('/', eventCtrl.create)
router.put('/:id', eventCtrl.update)
router.delete('/:id', eventCtrl.delete)

module.exports = router
