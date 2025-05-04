import React, { useState, useEffect } from 'react'
import './App.css';
import UserProfilePage from './Pages/UserProfile';
import FriendProfilePage from './Pages/FriendProfile';
import FriendProfile from './Pages/FriendProfile';

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
    <FriendProfilePage profiles={profiles } />
  )
}

export default App;
