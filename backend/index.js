const express = require('express')
const mainRouter = require('./routes')
const path = require('path')

const port = process.env.PORT
const app = express()
const indexPath = path.join(__dirname, '../build/index.html')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '../build')))

app.use('/', mainRouter)

app.get('/*', (req, res) => {
    res.sendFile(indexPath)
})


app.listen(port, () => console.log(`Server running on port ${port}`))