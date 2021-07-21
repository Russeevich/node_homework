const express = require('express')
const mainRouter = require('./routes')
const path = require('path')
const soc = require('./socket')

const port = process.env.PORT

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { allowEIO3: true })


const indexPath = path.join(__dirname, '../build/index.html')

soc.addListner(io)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '../build')))
app.use(express.static(path.join(__dirname, 'uploads')))

app.use('/', mainRouter)

app.get('/*', (req, res) => {
    res.sendFile(indexPath)
})

server.listen(port, () => console.log(`Server running on port ${port}`))