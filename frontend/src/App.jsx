import React from 'react'
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationsPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import VerifyEmail from './pages/VerifyEmail.jsx';
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js';
import { Navigate } from 'react-router';

//useQuery get data from api
//useMutation post,put,delete data to api

export default function App() {

  const {data:authData} =
    useQuery({ queryKey: ['authUser'], queryFn: async () => {
      const res = await axiosInstance.get('/me');
      return res.data;
    },
    retry:false
  })
  const authUser = authData?.user

  return (
    <div>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to ="/login"/>}/>
        <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/notification' element={authUser ? <NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path='/onboarding' element={authUser ? <OnboardingPage/> : <Navigate to="/login" />}/>
        <Route path='/call' element={authUser ? <CallPage/> : <Navigate to="/login"/>}/>
        <Route path='/chat' element={authUser ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>

    </div>

    
  )
}
