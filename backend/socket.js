const uuid = require('uuid')
const User = require('./database/user')
const { useDB } = require('./database')


let clients = {}
let message = []


module.exports = {
    addListner: (soc) => {
        soc.on('connection', (client) => {
            const id = uuid.v4()
            client.on('users:connect', async(data) => {
                const { username } = data

                const people = await useDB(async() => await User.findOne({ username }))

                if (!people.permission.chat.R)
                    return

                clients[client.id] = {
                    username,
                    socketId: client.id,
                    userId: id,
                    activeRoom: null
                }

                client.emit('users:list', Object.values(clients))

                client.broadcast.emit('users:add', clients[client.id])
            })

            client.on('message:add', async(data) => {
                const senderId = clients[data.roomId].userId

                const people = await useDB(async() => await User.findOne({
                    username: Object.values(clients).find(item => item.userId === senderId).username
                }))

                if (!people.permission.chat.C)
                    return

                const newMessage = {
                    ...data,
                    id: uuid.v4(),
                    senderId,
                    time: Date.now()
                }

                message.push(newMessage)

                soc.to(newMessage.roomId).emit('message:add', newMessage)
            })

            client.on('message:history', async(data) => {
                const { socketId } = Object.values(clients).find(item => item.userId === data.recipientId)

                const people = await useDB(async() => await User.findOne({ username: clients[client.id].username }))

                if (!people.permission.chat.R)
                    return

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