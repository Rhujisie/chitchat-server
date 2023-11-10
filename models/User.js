const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required:[true, 'Enter a name']
    },
    password: {
        type: String,
    }
}, {timestamps: true})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password)
}

UserSchema.methods.createAccessJWT = function (){
    return jwt.sign({userId: this._id, username: this.username},
        process.env.ACCESS_TOKEN_SECRET,
         {expiresIn: process.env.ACCESS_TOKEN_LIFETIME})
}
UserSchema.methods.createRefreshJWT = function (){
    return jwt.sign({userId: this._id, username: this.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_LIFETIME})
}

module.exports = mongoose.model('User', UserSchema)
