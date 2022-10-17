const asyncHandler = require('express-async-handler')  //for auto handling errors
const generateToken = require('../helpers/generateToken')
const Password = require("../modals/Password")
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
var cryptr = new Cryptr(process.env.JWT_SECRET)

const createPassword = asyncHandler(async (req, res) => {
    const { clientName, anydeskID, anydeskPassword, serverUser, serverPassword, databaseServerName, databaseServerUser, databaseServerPassword } = req.body   //destructuring the req.body 

    if(req.user.type !== 'admin'){
        res.status(400)
        throw new Error('Only Admin can access')
    }

    if (!clientName || !anydeskID || !anydeskPassword || !serverUser || !serverPassword || !databaseServerName || !databaseServerUser || !databaseServerPassword) {
        res.status(400);
        throw new Error("Please Entre All Fields")
    }

    const exists = await Password.findOne({ clientName, anydeskID, serverUser, databaseServerName })

    if (exists) {
        res.status(400)
        throw new Error("Duplicate Insertions")
    }

    const password = await Password.create({
        clientName, anydeskID, anydeskPassword, serverUser, serverPassword, databaseServerName, databaseServerUser, databaseServerPassword, createdBy: req.user._id
    }) //in return it will give the created user

    if (password) {
        res.status(201).json({
            password
        })
    } else {
        res.status(400)
        throw new Error("Failed to Create User")
    }

})
const allPasswords = asyncHandler(async (req, res) => {
    try {
        var passwords = await Password.find().lean()
        var resp = passwords.map(row => ({
            ...row,
            anydeskPassword: cryptr.decrypt(row.anydeskPassword),
            serverPassword: cryptr.decrypt(row.serverPassword),
            databaseServerPassword: cryptr.decrypt(row.databaseServerPassword)
          }
          ));
        res.status(200).send(resp)
    } catch (error) {
        res.status(400)
        throw new Error("Error While Fetching From Database")
    }
})
const updatePassword = asyncHandler(async (req, res) => {
    const { _id ,clientName, anydeskID, anydeskPassword, serverUser, serverPassword, databaseServerName, databaseServerUser, databaseServerPassword } = req.body   //destructuring the req.body 
    if(req.user.type !== 'admin'){
        res.status(400)
        throw new Error('Only Admin can access')
    }
    if (!_id || !clientName || !anydeskID || !anydeskPassword || !serverUser || !serverPassword || !databaseServerName || !databaseServerUser || !databaseServerPassword) {
        res.status(400)
        throw new Error("Required Fields Are Missing!")
    }

    const salt = await bcrypt.genSalt(10)

    const updatedPassword = await Password.findByIdAndUpdate(_id, {
        clientName, anydeskID, anydeskPassword: cryptr.encrypt(anydeskPassword),
        serverUser,
        serverPassword: cryptr.encrypt(serverPassword),
        databaseServerName,
        databaseServerUser,
        databaseServerPassword: cryptr.encrypt(databaseServerPassword),
        updatedBy: req.user._id
    }, { new: true })
    if (!updatedPassword) {
        res.status(404);
        throw new Error("Chat Not Found")
    } else {
        res.json(updatedPassword)
    }
})
const deletePssword = asyncHandler(async (req, res) => {
    const {id} = req.params
    if(req.user.type !== 'admin'){
        res.status(400)
        throw new Error('Only Admin can access')
    }
    if(!id){
        res.status(400)
        throw new Error("Id id required in params")
    }
    try {
        await Password.findByIdAndDelete(id)
        res.status(200).json({message:"Password Deleted Successfully!"});
    } catch (error) {
        res.status(400);
        throw new Error("Error while handling database deletion operations")
    }
})

module.exports = { createPassword, allPasswords, updatePassword, deletePssword }
