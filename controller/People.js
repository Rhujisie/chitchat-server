const User = require('../models/User')

const getPeople = async(req, res)=>{
    const {userId} = req.user
    const user = await User.find({_id: {$not : {$eq: userId}}})
    .lean().select('_id username')
    res.json(user)
}

module.exports = {getPeople}