
import Profile from "../Components/Profile"
import React, { useState, useEffect } from 'react'

function UserProfile() {
    const [profile, setProfile] = useState(null)
  
    // fetch User data from the backend
    useEffect(() => {
      fetch("/profile").then(
        response => response.json()
      ).then(data => {
          setProfile(data);
          console.log(data);
        })
        .catch(error => console.error("Error fetching profile:", error));
    }, []);

    if (!profile) {
        return <p>Loading profiles...</p>;
    }

    return (
        <div>
            <Profile key={profile.id || profile.name} data={profile} editable={true} self={true} />
        </div>
    );
};

export default UserProfile;
