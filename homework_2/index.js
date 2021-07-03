const express = require('express')
const app = express()
const port = 3000

var users = [

    ],
    timer = 0

app.get('/data', (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    users.push(res)
})

setInterval(() => {
    console.log(`Time: ${timer}`)
    if (++timer > 20) {
        users.forEach(user => {
            user.write('END\n')
            user.end()
        })
        timer = 0
        users = []
    }
    users.forEach((user, ndx) => {
        user.write(`UserId: ${ndx}, Time: ${timer}\n`)
    })
}, 1000)


app.listen(port, () => console.log(`Server start in port ${port}`))