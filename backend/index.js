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
    

    socket.on("userConnected", (username) => {
        console.log(`${username} connected`)

        for(let [key, value] of socketIdMap.entries()){
            if(value == username){
                delete socketIdMap[key]
                socketIdMap[socket.id] = username
                return
            }
        }



        socketIdMap[socket.id] = username
        updateDoc(doc(db, 'users',username),
        {
            online: true
        })
        console.log(socketIdMap)
        }

    )
    
    socket.on("userDisconnected", (username) => {

            try{

            console.log(`${username} disconnected`)
            console.log(socket.id)
           
            updateDoc(doc(db, 'users',username),
            {
                online: false
            })


            delete socketIdMap[socket.id]
            console.log(socketIdMap)
        } catch {

        }
    
       

    })

    socket.on("findUser", (destination, source) => {
        io.emit(destination, "findUser", source, null)
    })

    socket.on("response", (destination, source, key) => {
        io.emit(destination, "response", source, key)
    } )
    console.log("a user has connected")

    socket.on("disconnect", () => {

        try{
      
        console.log(socketIdMap[socket.id] + 'disconnected')
        updateDoc(doc(db, 'users',socketIdMap[socket.id]),
        {
            online: false
        })

        delete socketIdMap[socket.id]
    
    } catch {
        
    }
        

    })
})



server.listen(8080, () => {
    console.log("listening on 8080")
} )