import React from "react";
import Profile from "../Components/Profile"

function UserProfile() {
    // Dummy Data, have to change to get data from backend
    const userProfile = {
        name: "Tiffany Huynh",
        birthday: "01/01/2000",
        aboutMe: "Hi!"
      };
      
    return (
        <div>
            <Profile data={userProfile} editable={true} />
        </div>
    );
};

export default UserProfile;