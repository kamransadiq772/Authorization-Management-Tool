const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
var cryptr = new Cryptr(process.env.JWT_SECRET)

const userSchema = mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        type: { type: String, require: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }, {
    timestamps: true
}
)

userSchema.methods.matchpassword = async function (password) {
    return (password === cryptr.decrypt(this.password))
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }
    this.password = cryptr.encrypt(this.password)
})


const User = mongoose.model("User", userSchema)
module.exports = User