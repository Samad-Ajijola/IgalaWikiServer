const router = require('express').Router()
const projectCtrl = require('../controllers/projectCtrl')

router.get('/', projectCtrl.getAll)
router.post('/', projectCtrl.create)
router.put('/:id', projectCtrl.update)
router.delete('/:id', projectCtrl.delete)

module.exports = router
