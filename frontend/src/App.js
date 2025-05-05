import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfilePage from './Pages/UserProfile';
import FriendProfilePage from './Pages/FriendProfile';
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import FriendsPage from './Pages/FriendsPage'

function App() {
  const [myProfile, setMyProfile] = useState({})  // for the user profile
  const [profiles, setProfiles] = useState([{}])    // for the friend profiles

  useEffect(() => {
    fetch("/profile").then(
      response => response.json()
    ).then(data => {
        setMyProfile(data);
        console.log(data);
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, []);


  // fetch Friend data from the backend
  useEffect(() => {
    fetch("/friends").then(
      response => response.json()
    ).then(
      data => {
        setProfiles(data)
        console.log(data)
      }
    ).catch(error => console.error("Error fetching profiles:", error));
  }, [])

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<UserProfilePage profile={myProfile}/>} />
            <Route path="/friends" element={<FriendProfilePage profiles={profiles} />} />
            <Route path="/friends" element={<FriendsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;
