import React, {useState} from "react"
import { ReactDOM } from "react"
import HomePage from "./homePage"
import messagingPage from "./messagingPage"
import {useLocation, useNavigate} from "react-router-dom"
import '../css/combinedPage.css'
import MessagingPage from "./messagingPage"
import {addDoc, getFirestore, collection, getDocs, query, where, onSnapshot, setDoc, doc, QuerySnapshot, getDoc, updateDoc, arrayUnion, arrayRemove, setIndexConfiguration} from "firebase/firestore"
import {initializeApp} from "firebase/app"

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
    const {state} = useLocation();
    const navigate = useNavigate()
    const {username} = state
    const [target,setTarget] = useState('')
    const [chatRoomId,setChatRoomId] = useState('')
    console.log(username)
    return <div>
         <div className="topBar">
            <button onClick={() => {
         
                navigate("../")
            }}>
                Log Out
            </button>
            <div>{target}</div>
            <div></div>
            
        </div>
        <div className="sideBar">
        <div className="searchBar">
            <form onSubmit={async (e) => {
                e.preventDefault()
               
                var docRef = await getDoc(doc(db, `users`, e.target.friend.value))
                if(docRef.exists()){
                    setDoc(doc(db, `users/${username}/friends`, e.target.friend.value), {})
                    
                }
                

            }}>
                <input type='text' name='friend' placeholder="Find People"></input>
            </form>
        </div>
        <HomePage username = {username} setChatRoom={setChatRoomId} setTarget={setTarget}/>
    </div>
    <div className="sideBody">
       {(chatRoomId !='') && <MessagingPage username= {username} chatRoomId={chatRoomId} targetName={target}></MessagingPage>}
    </div></div>
}