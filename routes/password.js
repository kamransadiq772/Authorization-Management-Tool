const router = require('express').Router()
const { createPassword,updatePassword,deletePssword,allPasswords } = require('../controllers/passwordControllers')
const {protect} =  require('../middlewares/authMiddleware')

router.route('/').get(protect,allPasswords).post(protect,createPassword).put(protect,updatePassword)
router.route('/:id').delete(protect,deletePssword)

module.exports = router