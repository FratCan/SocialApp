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
import { Navigate } from 'react-router';
import PageLoader from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import { Toaster } from "react-hot-toast";

//useQuery get data from api
//useMutation post,put,delete data to api

export default function App() {
/*
  Bu kısmı custom bir hook içerisine taşıdım böylece bu kod parçacağı bazı sayfalarda tekrar tekrar yazılmayacak.

  const {data:authData,isLoading} =
    useQuery({ queryKey: ['authUser'],
    queryFn: getAuther,
    retry:false
  })
  const authUser = authData?.user;
*/

  const {authUser,isLoading} = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnaboarded = authUser?.isOnaboarded;

  if( isLoading ) return  <PageLoader/>;

  return (
    <div>
      <Routes>
        <Route path='/' element={isAuthenticated && isOnaboarded ? (
          <HomePage/>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )}/>
        <Route path='/signup' element={!isAuthenticated ? <SignupPage/> : <Navigate to="/"/>}/>
        <Route path='/login' element={!isAuthenticated ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path='/notification' element={isAuthenticated ? <NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path='/onboarding' element={isAuthenticated ? (!isOnaboarded ? (<Onboarding/>) : (<Navigate to="/"/>)) : (<Navigate to="/login"/>)}/>
        <Route path='/call' element={isAuthenticated ? <CallPage/> : <Navigate to="/login"/>}/>
        <Route path='/chat' element={isAuthenticated ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>
      <Toaster />
    </div>
  )
}
