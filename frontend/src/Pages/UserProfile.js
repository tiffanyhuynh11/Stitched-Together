import React from "react";
import Profile from "../Components/Profile"

function UserProfile({ profile }) {
    // Dummy Data, have to change to get data from backend
    const userProfile = {
        name: "Tiffany Huynh",
        birthday: "01/01/2000",
        aboutMe: "Hi!"
      };

  console.log("Profile data:", profile);

  if (!profile) {
    return <p>Loading profiles...</p>;
  }

    return (
        <div>
          <h1>My Profile</h1>
          <Profile key={profile.id || profile.name} data={profile} />
        </div>
    );
};

export default UserProfile;
