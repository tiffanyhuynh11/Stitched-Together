import React from "react";
import Profile from "../Components/Profile"

function UserProfile({ profile }) {
    console.log("Profile data:", profile);

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
