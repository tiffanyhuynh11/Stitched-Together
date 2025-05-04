import React, { useState, useEffect } from 'react'
import './App.css';
import UserProfilePage from './Pages/UserProfile';
import FriendProfilePage from './Pages/FriendProfile';

function App() {
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/friends").then(
      result => result.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    <div>
    </div>
  )
}

export default App;
