require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT
const delay = process.env.DELAY
const timestop = process.env.TIMESTOP

let users = [

]

app.get('/data', (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    users.push({ res, time: Date.now() })
})

const getDate = () => {
    var date = new Date()
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

    return new Date(now_utc)
}

setInterval(() => {
    const date = getDate()
    console.log(`Time: ${date}`)
    users.forEach((user, ndx) => {
        if (Date.now() - user.time < timestop) {
            user.res.write(`UserId: ${ndx}, Time: ${date}\n`)
        } else {
            user.res.write(`Time: ${date}, END\n`)
            user.res.end()
            users = users.filter((_, index) => index !== ndx)
        }
    })
}, delay)


app.listen(port, () => console.log(`Server start in port ${port}`))