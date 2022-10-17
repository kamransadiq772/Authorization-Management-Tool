const express = require('express')

const router = express.Router()
const {registerUser, authUser,allUsers, updateUser, deleteUser} = require('../controllers/userController')
const {protect} = require('../middlewares/authMiddleware')


router.route('/').post(protect,registerUser).get(protect,allUsers).put(protect,updateUser)
router.delete('/:id',protect,deleteUser) //one way (multiple routes could be chained)
router.post('/login',authUser)      // other way(without chaining)


module.exports = router