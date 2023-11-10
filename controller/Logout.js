

const logout  = async(req, res)=>{
    const {jwt: refreshToken} = req.cookies
    if(!refreshToken) return res.sendStatus(204)
    res.clearCookie('jwt', {
        httpOnly: true, //accessible only by web server
        secure: true,//https
        sameSite: 'None',//cross-site cookie 
    }
    ) 
    res.sendStatus(204)
}

module.exports = {logout}