const uuid = require('uuid')

let clients = {}
let message = []


module.exports = {
    addListner: (soc) => {
        soc.on('connection', (client) => {
            const id = uuid.v4()
            client.on('users:connect', data => {
                const { username } = data

                clients[client.id] = {
                    username,
                    socketId: client.id,
                    userId: id,
                    activeRoom: null
                }

                client.emit('users:list', Object.values(clients))

                client.broadcast.emit('users:add', clients[client.id])
            })

            client.on('message:add', data => {
                const newMessage = {
                    ...data,
                    id: uuid.v4(),
                    senderId: clients[data.roomId].userId,
                    time: Date.now()
                }
                message.push(newMessage)

                soc.to(newMessage.roomId).emit('message:add', newMessage)
            })

            client.on('message:history', data => {
                const { socketId } = Object.values(clients).find(item => item.userId === data.recipientId)

                client.join(socketId)
                clients[client.id].activeRoom = socketId

                const oldMessage = message.filter(item => item.roomId === socketId)

                client.emit('message:history', oldMessage)
            })

            client.on('disconnect', () => {
                client.broadcast.emit('users:leave', client.id)
                delete clients[client.id]
            })
        })
    }
}