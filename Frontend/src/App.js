import React, { lazy, Suspense } from 'react'
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from './components/Loading/Loading';
import { useSelector } from "react-redux";
import StoriesGallery from './components/Stories/StoriesGallery/StoriesGallery';

const Home = lazy(() => import("./pages/Home/Home"))
const Auth = lazy(() => import("./pages/Auth/Auth"))
const Chat = lazy(() => import("./pages/Chat/Chat"))
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"))
const Navbar = lazy(() => import("./components/Navbar/Navbar"))
const NotFound = lazy(() => import("./pages/NotFound/NotFound"))

function App() {
  const user = useSelector((state) => state.authReducer.authData)
  // var retrievedPerson = JSON.parse(localStorage.getItem('profile')); 
  // console.log(retrievedPerson.token);
  return (
    <>
      <div>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
            />
            <Route
              path="/home"
              element={user ? <> <Navbar /> <Home /></> : <Navigate to="../auth" />}
            />
            <Route
              path="/auth"
              element={user ? <Navigate to="../home" /> : <Auth />}
            />
            <Route
              path="/post/search"
              element={user ? <Navigate to="../home" /> : <Auth />}
            />
            <Route path="/profile/:id" element={user ? <> <Navbar /> <ProfilePage /></> : <Navigate to="../auth" />} />

            <Route path="/posts/:id" element={user ? <> <Navbar /> <StoriesGallery /></> : <Navigate to="../auth" />} />

            <Route path="/chat" element={user ? <> <Navbar /> <Chat /></> : <Navigate to="../auth" />} />

            <Route
              path="*"
              element={
                <> <Navbar />  <NotFound /></>
              }
            />
          </Routes>
        </Suspense>
      </div>

    </>
  );
}

export default App;
