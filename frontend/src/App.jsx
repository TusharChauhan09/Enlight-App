import { axiosInstance } from "./lib/axios"

import Navbar from "./components/Navbar"
import HomePage from "./components/HomePage"
import SignUpPage from "./components/SignUpPage"
import LoginPage from "./components/LoginPage"
import SettingsPage from "./components/SettingsPage"
import ProfilePage from "./components/ProfilePage"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"

const App = () => {

  const {authUser , checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  console.log({authUser});

  // loader checkAuth and finding authUser
  if( isCheckingAuth && !authUser){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }



  return (
    <div>

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={ (authUser!==null) ?  <HomePage/> : <Navigate to="/login" /> } />
        <Route path="/signup" element={ (authUser===null) ? <SignUpPage/> : <Navigate to="/" /> } />
        <Route path="/login" element={ (authUser===null) ? <LoginPage/>  : <Navigate to="/" /> } />
        <Route path="/settings" element={ <SettingsPage/> } />
        <Route path="/profile" element={ (authUser!==null) ? <ProfilePage/> : <Navigate to="/login" /> } />
      </Routes>

    </div>
  )
}

export default App
