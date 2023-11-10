
const ws = require('ws')
const jwt = require('jsonwebtoken')
const Message = require('./models/Message')
const fs = require('fs')

const handleRefreshToken = require('./controller/RefreshToken')
const auth = require('./error-middleware/authentication')

const webSocketServer = (server)=>{
    const wss = new ws.WebSocketServer({server})
    wss.on('connection', (connection, req)=>{
       //get online users
       const notifyOnlineUser = ()=>{
        ([...wss.clients].forEach(client=> {
            client.send(JSON.stringify({
                online: [...wss.clients].map(client=>({
                    userId: client.userId, username: client.username
                }))
            }))
        }))
    }

        //checking liveliness
        connection.isAlive = true

        connection.timer = setInterval(()=>{
            connection.ping()

            connection.deathTimer = setTimeout(()=>{
                connection.isAlive = false
                clearInterval(connection.timer)
                connection.terminate()
                notifyOnlineUser()
            }, 1000)
        }, 5000)

        connection.on('pong', ()=>{
            clearTimeout(connection.deathTimer)
        })

        //recieve and send message to recepient
        connection.on('message', async (message)=>{
            const {text, recipient, file} = JSON.parse(message)
            let filename = null

            //save incoming file
            if(text === 'terminate'){
                connection.terminate()
            }
            if(file){
                filename = file.name
                const path = './uploads/' + filename
                const bufferData = new Buffer.from(file.data.split(',')[1], 'base64');
                //change this to async
                fs.writeFile(path, bufferData, () => {
                });
            }
            if(recipient && text || file){
                const message = await Message.create({
                    sender: connection.userId,
                    recipient,
                    text,
                    file: filename
                });

                ([...wss.clients].filter(client=> client.userId === recipient)
                    .forEach(c=> c.send(JSON.stringify({
                        text, 
                        recipient,
                        sender:connection.userId,
                        id: message._id,
                        time: message.createdAt,
                        file: file ? filename : null,
                    }))))
            }
        })

        //read username and userId connected using cookie
        const cookies = req.headers.cookie
        if(cookies){
            const tokenCookieString = cookies.split(';').find(
                str=> str.startsWith('jwt')
            )
            
            if(tokenCookieString){
                const token = tokenCookieString.split('=')[1]
                if(token){
                    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, 
                        async (err, decoded)=>{
                            if(err) {
                                return res.status(403).json(err)
                            }
                            const {userId, username} = decoded
                            connection.userId = userId 
                            connection.username = username
                        }
                    )
                }
            }
        }
        notifyOnlineUser()
    })
    //check *****************************************************
    //disconnect ws
    wss.on('close', (data)=>{
        console.log('disconnected', data)
    })
}

module.exports = webSocketServer