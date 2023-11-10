const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')
require('dotenv').config()

const handleRefreshToken = async (req, res)=>{
    const {jwt:refreshToken} = req.cookies
    if(!refreshToken) throw new UnauthenticatedError('Authorization invalid')
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded)=>{
            //Cannot set headers after they are sent to the client
            if(err) {
                return res.status(403).json(err)
            }
            const accessToken = jwt.sign(
                {userId: decoded.userId,
                username: decoded.username
                }, 
                process.env.ACCESS_TOKEN_SECRET, {expiresIn:'5m'}
            )
            const user = await User.findById(decoded.userId).select('-password')
            return res.json({accessToken, username: user.username, userId: user._id})
        }
    )
}
module.exports = handleRefreshToken