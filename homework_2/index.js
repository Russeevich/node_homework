const express = require('express')
const app = express()
const port = process.env.PORT
const delay = process.env.DELAY || 1000
const timestop = process.env.TIMESTOP || 10000

let users = []

app.get('/data', (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    users.push({ res, time: Date.now() })
})

const getDate = () => {
    const date = new Date(),
        now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

    return new Date(now_utc)
}

setInterval(() => {
    if (users.length > 0) {
        const date = getDate()
        console.log(`Time: ${date}`)
        users.forEach((user, ndx) => {
            if (Date.now() - user.time >= timestop) {
                user.res.write(`Time: ${date}, END`)
                user.res.end()
                users = users.filter((_, index) => index !== ndx)
            }
        })
    }
}, delay)


app.listen(port, () => console.log(`Server start in port ${port}`))