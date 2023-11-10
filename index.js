//import express
const express = require('express')
const app = express()

//import
require('dotenv').config()
require('express-async-errors')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const ws = require('ws')
const fs = require('fs')

//message model
const Message = require('./models/Message')

//import middleware
const notFoundMiddleware = require('./error-middleware/notFound')
const errorHandlerMiddleware = require('./error-middleware/errorHandler')
const authenticationMiddleware = require('./error-middleware/authentication')

//import routes
const authRouter = require('./routes/Auth')
const refreshRouter = require('./routes/refresh')
const messageRouter = require('./routes/Message')
const peopleRouter = require('./routes/People')
const logoutRouter = require('./routes/Logout')

//import connect DB
const connectDB = require ('./connectDB')
const webSocket = require('./webSocket')

//dependencies
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors(corsOptions))
app.use(cookieParser())

//routes
// app.post('/post',(req, res)=>{
//     console.log('here', req.files)
//     res.json(req.files)
// })
app.use('/uploads',express.static('./uploads'))
app.use('/auth', authRouter)
app.use('/refresh', refreshRouter)
app.use('/message', authenticationMiddleware, messageRouter)
app.use('/people', authenticationMiddleware, peopleRouter)
app.use('/logout', authenticationMiddleware, logoutRouter)

//error handler middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000

//connection to db
const start = async()=> {
    try{
        await connectDB(process.env.MONGO_URL)
        const server = app.listen(PORT, ()=>{
            console.log(`Server is listening on port ${PORT}`)
        })
        webSocket(server)
    }catch(err){
        console.log(err)
    }
}

start()
