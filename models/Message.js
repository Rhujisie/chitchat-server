const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId, ref: 'User'
    },
    recipient: {
        type: mongoose.Types.ObjectId, ref: 'User'
    },
    text: String,
    file: String
}, {timestamps: true})

module.exports = new mongoose.model('Message', MessageSchema)