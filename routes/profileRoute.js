const router = require('express').Router()
const { updatePassword } = require('../controllers/profileController')
const {protect} =  require('../middlewares/authMiddleware')

router.put('/',protect,updatePassword)

module.exports = router