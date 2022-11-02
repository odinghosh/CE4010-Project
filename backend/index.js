const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require("socket.io")
const {initializeApp} = require('firebase/app')
const {getFirestore, updateDoc, doc} = require('firebase/firestore')



const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


const socketIdMap = new Map()

const firebaseConfig = {
    apiKey: "AIzaSyA-EBrDm3FjdRmjwAQGU_1ocSKYoGN-BYQ",
    authDomain: "ce4010-project.firebaseapp.com",
    projectId: "ce4010-project",
    storageBucket: "ce4010-project.appspot.com",
    messagingSenderId: "332473893693",
    appId: "1:332473893693:web:08ba18e137a40f3edb7b54",
    measurementId: "G-Z7W69JFQ20"
  };

const firebaseapp = initializeApp(firebaseConfig)

const db = getFirestore(app)


app.get('/', (req, res) => {
    res.send("hello world")
})

io.on('connection', (socket) => {
    if(socket.handshake.query['username']){
        socketIdMap[socket.id] = socket.handshake.query['username']
        updateDoc(doc(db, 'users',socket.handshake.query['username']),
        {
            online: true
        })


        console.log(socketIdMap)
    }
    socket.on("findUser", (destination, source) => {
        io.emit(destination, "findUser", source, null)
    })

    socket.on("response", (destination, source, key) => {
        io.emit(destination, "response", source, key)
    } )
    console.log("a user has connected")

    socket.on("disconnect", () => {
        console.log(socketIdMap[socket.id] + 'disconnected')
        

        updateDoc(doc(db, 'users',socketIdMap[socket.id]),
        {
            online: false
        })

        socketIdMap.delete(socket.id)

    })
})



server.listen(8080, () => {
    console.log("listening on 8080")
} )