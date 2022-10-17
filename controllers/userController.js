const asyncHandler = require('express-async-handler')  //for auto handling errors
const generateToken = require('../helpers/generateToken')
const User = require("../modals/User")
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
var cryptr = new Cryptr(process.env.JWT_SECRET)

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, type } = req.body   //destructuring the req.body 

  if (req.user.type !== 'admin') {
    res.status(400)
    throw new Error('Only Admin can access')
  }

  if (!email || !name || !password || !type) {
    res.status(400);
    throw new Error("Please Entre All Fields")
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User Email Already Exists")
  }

  const user = await User.create({
    name, email, password, type, createdBy: req.user._id
  }) //in return it will give the created user

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      createdBy: req.user._id
    })
  } else {
    res.status(400)
    throw new Error("Failed to Create User")
  }

})

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new Error('Required Fields are Missing')
  }

  const user = await User.findOne({ email })

  if (user && (await user.matchpassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      token: generateToken(user._id, user.type)
    })
  } else {
    res.status(400)
    throw new Error("Invalid Credential")
  }

})

const allUsers = asyncHandler(async (req, res) => {
  try {
    var result = await User.find().lean()
    var resp = result.map(row => ({
      ...row,
      password: cryptr.decrypt(row.password)
    }
    ));
    res.status(200).json(resp)
  } catch (error) {
    res.status(400)
    throw new Error("Error While Fetching From Database")
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const { _id, name, email, password, type } = req.body
  if (req.user.type !== 'admin') {
    res.status(400)
    throw new Error('Only Admin can access')
  }
  if (!_id || !name || !email || !password || !type) {
    res.status(400)
    throw new Error("Required Fields Are Missing!")
  }

  const salt = await bcrypt.genSalt(10)

  const updatedUser = await User.findByIdAndUpdate(_id, {
    name, email, password : cryptr.encrypt(password) , type, updatedBy: req.user._id
  }, { new: true })
  if (!updatedUser) {
    res.status(404);
    throw new Error("User Not Found")
  } else {
    res.json(updatedUser)
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (req.user.type !== 'admin') {
    res.status(400)
    throw new Error('Only Admin can access')
  }
  if (!id) {
    res.status(400)
    throw new Error("Id is required in params")
  }
  try {
    await User.findByIdAndDelete(id)
    res.status(200).json({ message: "User Deleted Successfully!" });
  } catch (error) {
    res.status(400);
    throw new Error("Error while handling database deletion operations")
  }
})

module.exports = { registerUser, authUser, allUsers, updateUser, deleteUser }
