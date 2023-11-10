const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors/index')

//check payload
const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authenticaion invalid')
    }
    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,)
        req.user = {userId: payload.userId, name: payload.name}
    }catch(err){
        //[ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        res.status(403).json(err)
    }   
    next()
}

module.exports = auth