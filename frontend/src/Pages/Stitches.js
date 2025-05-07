
import FriendsGraph from "../Components/FriendsGraph"
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function Stitches() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null)  // for the user profile
    const [profiles, setProfiles] = useState([])    // for the friend profiles
  
    // fetch User data from the backend
    useEffect(() => {
      fetch("/profile").then(
        response => response.json()
      ).then(data => {
          setUser(data);
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
        <div className="min-h-screen bg-blue-50 relative">
            <h1 className="text-center text-2xl font-bold py-4 text-peach-500">Your Friends</h1>
            <FriendsGraph user={user} friends={profiles}/>

            <button
                onClick={() => navigate('/new-friend')}
                className="fixed bottom-6 right-6 bg-peach-500 hover:bg-peach-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transition"
            >
                + Add Friend
            </button>
        </div>
    );
};

export default Stitches;
