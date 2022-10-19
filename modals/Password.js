const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
var cryptr = new Cryptr(process.env.JWT_SECRET)

const passwordSchema = mongoose.Schema({
    clientName: { type: String, require: true },
    anydeskID: { type: String, require: true },
    anydeskPassword: { type: String, require: true },
    serverUser: { type: String, require: true },
    serverPassword: { type: String, require: true },
    databaseServerName: { type: String, require: true },
    databaseServerUser: { type: String, require: true },
    databaseServerPassword: { type: String, require: true },
    description:{type:String},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
})
passwordSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.anydeskPassword = cryptr.encrypt(this.anydeskPassword)
    this.serverPassword = cryptr.encrypt(this.serverPassword)
    this.databaseServerPassword = cryptr.encrypt(this.databaseServerPassword)
})

const Password = mongoose.model('Password', passwordSchema)
module.exports = Password;