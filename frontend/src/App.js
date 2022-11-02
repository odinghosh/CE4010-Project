import logo from './logo.svg';
import MessagePage from "./pages/messagingPage"
import RegistrationPage from "./pages/registration"
import HomePage from "./pages/homePage"
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<RegistrationPage/>}/>
    <Route path="/home" element={<HomePage/>}/>
    <Route path="/chats" element={<MessagePage/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
