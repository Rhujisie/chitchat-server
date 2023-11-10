const Message = require('../models/Message')

const getMessage = async(req, res)=>{
    const {userId} = req.user
    const {id} = req.params
    const message = await Message.find({recipient:{$in:[userId, id]}, 
        sender: {$in :[userId, id]}}).sort({createdAt: 1}).lean()
    res.json(message)
}

module.exports = {getMessage}