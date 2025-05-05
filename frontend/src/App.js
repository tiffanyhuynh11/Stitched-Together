import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfilePage from './Pages/UserProfile';
import FriendProfilePage from './Pages/FriendProfile';
import HomePage from './Pages/HomePage';

function App() {
  const [profiles, setProfiles] = useState([{}])

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
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/profile" element={<UserProfilePage/>} />
        <Route path="/friend" element={<FriendProfilePage profiles={profiles} />} />
      </Routes>
    </Router>
  )
}

export default App;
