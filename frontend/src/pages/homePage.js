import React, {useState, useEffect} from "react";
import { ReactDOM } from "react";
import {addDoc, getFirestore, collection, getDocs, query, where, onSnapshot, setDoc, doc, QuerySnapshot, getDoc, updateDoc} from "firebase/firestore"
import {initializeApp} from "firebase/app"
import {useLocation, useNavigate} from "react-router-dom"
import {io} from "socket.io-client";
import forge from "node-forge"
import "../css/homePage.css"


const firebaseConfig = {
    apiKey: "AIzaSyA-EBrDm3FjdRmjwAQGU_1ocSKYoGN-BYQ",
    authDomain: "ce4010-project.firebaseapp.com",
    projectId: "ce4010-project",
    storageBucket: "ce4010-project.appspot.com",
    messagingSenderId: "332473893693",
    appId: "1:332473893693:web:08ba18e137a40f3edb7b54",
    measurementId: "G-Z7W69JFQ20"
  };

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const socket = io("http://localhost:8080")







export default function (){

    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const {state} = useLocation();
     
  
        
    socket.on("connect", () => {
        console.log("connected2")
    })

   

    const {username} = state

   

    async function openChat(event) {
        const docRefA = doc(db, "chatRooms", username + "-" + event.target.innerHTML)
        const docRefB = doc(db, "chatRooms", event.target.innerHTML + "-"+username)

        const docSnapA = await getDoc(docRefA)
        const docSnapB = await getDoc(docRefB)

         if(docSnapA.exists()){
             navigate("../chats", {state: {chatRoomId: username + "-" + event.target.innerHTML, username: username}} )
         } else if(docSnapB.exists()){
             navigate("../chats", {state: {chatRoomId: event.target.innerHTML + "-"+ username, username: username}} )
         } else {
            socket.emit("findUser","" + (event.target.innerHTML), username)
         }
    }
    
    function trackActiveUsers() {
        const q = query(collection(db, "users"), where("online", "==", true));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            var users = []
            querySnapshot.forEach((doc) => {
                if(doc.id != username){
                    users.push({"username": doc.id})
                }
            })
            setUsers(users)
        })
        
    }

   


    useEffect(() => {

        socket.emit("userConnected", username)
    
        var rsa = forge.pki.rsa
        var keypair = rsa.generateKeyPair({bits: 512, e:0x10001})
        var n = (keypair.publicKey.n).toString()
        var e = (keypair.publicKey.e).toString()
        const rsaPrivateKey = keypair.privateKey
        console.log('generated')
        updateDoc(doc(db, "users", username), {publicKeyN: n,  publicKeyE: e})
        
        trackActiveUsers()
        socket.on(username, async (reqType, source, keyTransmitted) => {
           
            if(reqType == 'findUser'){

                 //find the rsa public key of target
            var rsa = forge.pki.rsa
            const docRefC = doc(db, "users", source)
            const docSnap = await getDoc(docRefC)
            var publicKey = rsa.setPublicKey(new forge.jsbn.BigInteger(docSnap.data()['publicKeyN']), 
            new forge.jsbn.BigInteger(docSnap.data()['publicKeyE']))
            
            //create new aes key
            var key = forge.random.getBytesSync(16);
            localStorage.setItem(source+"-"+username, key)
            key = publicKey.encrypt(key)
            console.log(key)
            socket.emit("response", source, username, key)
            }

            if(reqType == 'response'){

                console.log(keyTransmitted)
                var aesKey = rsaPrivateKey.decrypt(keyTransmitted)
            
                localStorage.setItem(username+"-"+source, aesKey)
                //console.log(localStorage.getItem(username+"-"+source))

                await setDoc(doc(db, "chatRooms", username+"-"+source), {})
                navigate("../chats", {state: {chatRoomId: username + "-" + source, username: username}}) 
                
            }
        })
        return () => socket.off(username)    
    },[])

    return (<div className="homePage">
        <div className="topBar">
            <button onClick={() => {
                socket.disconnect()
                navigate("../")
            }}>
                Go Back
            </button>
            <div>Online Users</div>
            <div></div>
        </div>
        <ul>
            {
            users.map((user) => {
                return <li><button className="activeUser" onClick={openChat}>
                    {user.username}
                    </button></li>
            })}
        </ul>


    </div>)

}