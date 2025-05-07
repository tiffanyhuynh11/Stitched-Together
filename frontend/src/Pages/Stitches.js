
import FriendsGraph from "../Components/FriendsGraph"
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'

function Stitches() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null)  // for the user profile
    const [profiles, setProfiles] = useState([])    // for the friend profiles
    const [showHelp, setShowHelp] = useState(false);
  
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
             {/* WHen the ? button is clicked, ensures that the friends graph is uninteractable */}
             <div className={showHelp ? "pointer-events-none opacity-30" : ""}>
                <FriendsGraph user={user} friends={profiles} />
            </div>

            {/* DIsplays information of how to use friend's graph*/}
            <button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-20 right-6 bg-white border-2 border-peach-500 text-peach-500 hover:bg-peach-100 font-bold w-12 h-12 rounded-full shadow-lg z-30"
                title="Help"
            >
                ?
            </button>
            {showHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-3/4 max-w-md text-center">
                        <h2 className="text-xl font-semibold mb-4 text-peach-500">How to Use</h2>
                        <p className="text-gray-700 mb-4">
                            Click on a friend to edit their information! 
                            You can also drag a friend onto another to 
                            visualize the connection between them.
                        </p>
                        <button
                            onClick={() => setShowHelp(false)}
                            className="mt-2 px-4 py-2 bg-peach-500 hover:bg-peach-400 text-white rounded-lg transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Will prompt them to add a new friend (friend is only added when saved)*/}
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
