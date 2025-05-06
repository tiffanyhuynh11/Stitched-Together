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
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;


//        # / - nothing
//# / profile - get and post for editing users profile only COMPLETE
//# / my - stitches - get all profiles from the db, user is the center node
//# / friend - add number or something to the url, use the auto incremented id ? Or name ? Grab the 1 friend profile and allow edits(get and post)
//# / new- friend - post input from frontend into db as new profile
//# / birthdays - get birthdays and names for each profile(user included) should be able to link to their indiv friend page
