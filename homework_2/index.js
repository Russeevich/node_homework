const express = require('express')
const app = express()
const port = process.env.PORT
const delay = process.env.DELAY || 1000
const timestop = process.env.TIMESTOP || 10000

app.get('/data', (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    setInterval(() => {
        const date = new Date().toISOString()
        console.log(`Time: ${date}`)
    }, delay)
    setTimeout(() => {
        const date = new Date().toISOString()
        res.write(`Time: ${date}, END`)
        res.end()
    }, timestop)
})


app.listen(port, () => console.log(`Server start in port ${port}`))