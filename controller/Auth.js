const User = require('../models/User')
const {BadRequestError ,UnauthenticatedError} = require('../errors')

const register = async(req, res)=>{

    const {username, password} = req.body
    const findUser = await User.findOne({username}).lean()

    if(findUser){
        throw new BadRequestError('Username already exists')
    }

    const user = await User.create(req.body)

    const accessToken = user.createAccessJWT()
    const refreshToken = user.createRefreshJWT()
    res.cookie('jwt', refreshToken, 
    {
        httpOnly: true, //accessible only by web server
        secure: true,//https
        sameSite: 'None',//cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000,//cookie epiry: set to macth rt
        }
    )
    res.status(201).json({accessToken, username: user.username, id: user._id})
}
const login = async(req, res)=>{
    const {username, password} = req.body
    const user = await User.findOne({username})
    
    if(!user){
        throw new UnauthenticatedError('Incorrect username')
    }
    const isCorrectPassword = await user.comparePassword(password)

    if(!isCorrectPassword){
        throw new UnauthenticatedError('Incorrect password')
    }
    const accessToken = user.createAccessJWT()
    const refreshToken = user.createRefreshJWT()
    res.cookie('jwt', refreshToken,
        {
        httpOnly: true, //accessible only by web server
        secure: true,//https
        sameSite: 'None',//cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000,//cookie epiry: set to macth rt
        }
    )
    res.json({accessToken, username: user.username, userId: user._id})
} 

module.exports = {register, login}