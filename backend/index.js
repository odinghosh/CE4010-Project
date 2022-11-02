const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require("socket.io")

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


app.get('/', (req, res) => {
    res.send("hello world")
})

io.on('connection', (socket) => {
    socket.on("findUser", (destination, source) => {
        io.emit(destination, "findUser", source, null)
    })

    socket.on("response", (destination, source, key) => {
        io.emit(destination, "response", source, key)
    } )
    console.log("a user has connected")
})

server.listen(8080, () => {
    console.log("listening on 8080")
} )