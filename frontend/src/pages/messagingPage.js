import React from "react";
import { ReactDOM, useState, useEffect, useRef} from "react";
import "../css/messagingPage.css"
import {useLocation, useNavigate} from "react-router-dom"
import {initializeApp} from "firebase/app"
import {doc,setDoc,addDoc, getFirestore, collection, getDocs, query, where, onSnapshot, serverTimestamp} from "firebase/firestore"
import forge from "node-forge"

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


export default function(props) {
    

    const navigate = useNavigate()

    //const {state} = useLocation();
    //const {chatRoomId, username} = state
    const chatRoomId = props.chatRoomId
    const username = props.username
    const targetName = props.targetName
    
    var aesKey = localStorage.getItem(chatRoomId)
    //console.log(aesKey)

    var cipher = forge.cipher.createCipher('AES-CBC', localStorage.getItem(chatRoomId))
    var decipher = forge.cipher.createDecipher('AES-CBC', localStorage.getItem(chatRoomId))
    
    //[chatRoomId, setChatRoomId] = useState()

    const [messages, setMessages] = useState([])

    const [inputText, setInputText] = useState('')

    // function to send a new message to firebase
    function sendMessageToFirebase(event){
        event.preventDefault()
        setInputText('')
        setDoc(doc(db,`users/${targetName}/friends`, username), {newMessage:true})

        var iv = forge.random.getBytesSync(16)
        console.log(iv)
        cipher.start({iv:iv})
        cipher.update(forge.util.createBuffer(event.target.text.value))
        cipher.finish()
        var encryptedText = cipher.output
        //console.log(encryptedText)
    
        // add data to firebase
        const docRef = addDoc(collection(db, `/chatRooms/${chatRoomId}/messages`), 
        {
            username : username,
            text: encryptedText.getBytes(),
            iv: iv,
            time: serverTimestamp()
        })
    }

    // function to listen to new messages from firebase
    function listenToFirebase() {
        const q = query(collection(db, `/chatRooms/${chatRoomId}/messages`))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            var messages = []
            querySnapshot.forEach((doc) => {
               
                decipher.start({iv:doc.data()['iv']})
                decipher.update(forge.util.createBuffer(doc.data()['text']))
                decipher.finish()
                console.log(decipher.output)
                messages.push({username: doc.data()['username'], text:decipher.output.data,
            time: doc.data()['time'].toDate().getTime()})
            })
            messages.sort((a,b) => {
                return (a.time - b.time)
            })
            setMessages(messages)
          
        })
    }
    
    useEffect(()=> {
       listenToFirebase()
      
    }, [chatRoomId])


    return (
    <div className="messagingPage">
        

        <div className = "messagingArea"> 
            <div className="messageList">
                <ul>
                    {
                        messages.map(message => {
                            return (<li >
                                <div className="messageItem">
                                    <div className="messageItemHeader">
                                        {message.username}
                                    </div>

                                    <div className="messageItemText">
                                        {message.text}
                                    </div>

                                </div>
                                </li>
                            )
                        })
                    }

                    <li ref={(curRef) =>{
                        try{
                        curRef.scrollIntoView()
                        } catch {}

                    }}></li>

                </ul>

            </div>
            <div className="messageBox">
                <form onSubmit={sendMessageToFirebase}>
                <input type="text" name="text" value={inputText} placeholder="Send a message" onChange={(e)=> {
                    setInputText(e.target.value)
                }}></input>
                <input type="submit" value='send'></input>
                </form>

            </div>
        </div>

    </div>
    )
}