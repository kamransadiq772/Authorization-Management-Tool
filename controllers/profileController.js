const asyncHandler = require('express-async-handler')  //for auto handling errors
const generateToken = require('../helpers/generateToken')
const User = require("../modals/User")
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
var cryptr = new Cryptr(process.env.JWT_SECRET)

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPass, password } = req.body
    if (req.user.type !== 'admin') {
      res.status(400)
      throw new Error('Only Admin can access')
    }
    if (!oldPass || !password) {
      res.status(400)
      throw new Error("Required Fields Are Missing!")
    }
    if(oldPass !== cryptr.decrypt(req.user.password)){
        res.status(400)
        throw new Error("Invalid Old Password")
    }  
    const salt = await bcrypt.genSalt(10)
  
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      password : cryptr.encrypt(password)
    }, { new: true })
    if (!updatedUser) {
      res.status(404);
      throw new Error("User Not Found")
    } else {
      res.json(updatedUser)
    }
  })

  module.exports = {updatePassword}