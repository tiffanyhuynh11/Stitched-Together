// This is a reusable component, you can add this to friend profile as well and set the editables to false
// Look at UserProfile.js in Pages for an example of how to use

import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ data, editable = false, onSave }) => {
    const [profile, setProfile] = useState(data);
    const [isEditing, setIsEditing] = useState(false);

    // This handles the user changing the text box for any user detail
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // This saves the user's changes and closes editing mode
    const handleSave = () => {
        setIsEditing(false);
        onSave && onSave(profile);
    };

    return (
        <div className="profile-container">
            <h2 className="profile-title">{editable ? "Your Profile" : `${data.name}'s Profile`}</h2>
            <hr></hr>
            {/* Edit Mode */}
            {editable && isEditing ? (
                <>
                    <label className="profile-label">Name:</label>
                    <input name="name" value={profile.name} onChange={handleChange} className="profile-input" />

                    <label className="profile-label">Birthday:</label>
                    <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} className="profile-input" />

                    <label className="profile-label">About Me:</label>
                    <textarea name="aboutMe" value={profile.aboutMe} onChange={handleChange} className="profile-input" />

                    <button onClick={handleSave} className="profile-button save">Save</button>
                </>
            ) : (
                <>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Birthday:</strong> {profile.birthday}</p>
                    <p><strong>About Me:</strong> {profile.aboutMe}</p>

                    {editable && (
                        <button onClick={() => setIsEditing(true)} className="profile-button edit">Edit</button>
                    )}
                </>
            )}
        </div>
    );
};

export default Profile;
