import React, {useState, useEffect} from "react";
import { ReactDOM } from "react";
import {addDoc, getFirestore, collection, getDocs, query, where, onSnapshot, setDoc, doc, QuerySnapshot, getDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore"
import {initializeApp} from "firebase/app"
import {useLocation, useNavigate} from "react-router-dom"
import {io} from "socket.io-client";
import forge from "node-forge"
import "../css/homePage.css"
import {socket} from "../socketConnection"


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









export default function (){

    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const {state} = useLocation();
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
            //socket.emit("findUser","" + (event.target.innerHTML), username)

            var rsa = forge.pki.rsa
            const docRefC = doc(db, "users", event.target.innerHTML)
            const docSnap = await getDoc(docRefC)
            var publicKey = rsa.setPublicKey(new forge.jsbn.BigInteger(docSnap.data()['publicKeyN']), 
            new forge.jsbn.BigInteger(docSnap.data()['publicKeyE']))
            
            //create new aes key
            var key = forge.random.getBytesSync(16);
            var serverName = username + "-" + event.target.innerHTML
            localStorage.setItem(username+"-"+event.target.innerHTML, key)
            key = publicKey.encrypt(key)
            console.log(key)
    
            updateDoc(docRefC, {
                inbox: arrayUnion({[serverName]: key})
            })

            await setDoc(doc(db, "chatRooms", serverName), {})
            navigate("../chats", {state: {chatRoomId: serverName, username: username}}) 
         }
    }
    
    function trackActiveUsers() {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            var users = []
            querySnapshot.forEach((doc) => {
                if(doc.id != username){
                    users.push({"username": doc.id})
                }
            })
            setUsers(users)
        })

        return unsubscribe
        
    }

    function getNewAesKeys(rsaPrivateKey) {
        const unsub = onSnapshot(doc(db, 'users', username),async (docRes) => {
            console.log('1')
            try{
                const array = [...docRes.data()['inbox']]
                if(array.length > 0){
                    for (var i = 0; i < array.length; i++){
                        var serverName = Object.keys(array[i])[0]
                        var encryptedAesKey = Object.values(array[i])[0]
                        var aesKey = rsaPrivateKey.decrypt(encryptedAesKey)
                        console.log(aesKey)
                        localStorage.setItem(serverName, aesKey)

                    }

                    await updateDoc(doc(db, 'users', username), {
                        inbox: []
                    })
                }

            } catch (e) {
                console.log(e)

            }
        })

        return unsub
    }

   


    useEffect(() => {
        var keyPem = JSON.parse(localStorage.getItem(username))
        var rsaPrivateKey = forge.pki.privateKeyFromPem(keyPem.privateKeyPem)
    
        socket.emit("userConnected", username)

        const unsubA = getNewAesKeys(rsaPrivateKey)
        
        
        const unsubB = trackActiveUsers()
        
        return () => {
             unsubA() 
             unsubB()}    
    },[])

    return (<div className="homePage">
        <div className="topBar">
            <button onClick={() => {
                socket.emit("userDisconnected", username);
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