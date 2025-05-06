import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfilePage from './Pages/UserProfile';
import FriendProfilePage from './Pages/FriendProfile';
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import Stitches from './Pages/Stitches';
import NewFriendPage from './Pages/NewFriend';
import CalendarPage from './Pages/CalendarPage';

function App() {
  const [myProfile, setMyProfile] = useState(null)  // for the user profile
  const [profiles, setProfiles] = useState([])    // for the friend profiles

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
    fetch("/my-stitches").then(
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
            <Route path="/friend/:friendId" element={<FriendProfilePage />} />
            <Route path="/my-stitches" element={<Stitches user={myProfile} profiles={profiles}/>} />
            <Route path="/new-friend" element={<NewFriendPage />} />
            <Route path="/calendar" element={<CalendarPage user={myProfile} profiles={profiles}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;

