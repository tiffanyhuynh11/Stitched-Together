import React from "react";
import Profile from "../Components/Profile"

function FriendProfile({ profiles }) {
  console.log("Profiles data:", profiles);

  if (!profiles || profiles.length === 0) {
    return <p>Loading profiles...</p>;
  }


  return (
    <div>
      {profiles.map((profile) => (
        <Profile key={profile.id || profile.name} data={profile} />
      ))}
    </div>
  );

};

export default FriendProfile;
