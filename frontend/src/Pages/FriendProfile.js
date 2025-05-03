import React from "react";
import Profile from "../Components/Profile"

function FriendProfile() {
    // Dummy Data, have to change to get data from backend
    const friendProfile = {
        name: "Casey Class",
        birthday: "01/01/1999",
        aboutMe: "Hello!"
    };

      // non editable for now, may change in the future for adding friend details
    return (
        <div>
            <Profile data={friendProfile} editable={false} />
        </div>
    );
};

export default FriendProfile;