import React, { useState } from 'react';

const Profile = ({ data, editable = false, onSave }) => {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave && onSave(profile);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {editable ? 'Your Profile' : `${data.name}'s Profile`}
        </h2>
        <hr className="mb-4" />
        {editable && isEditing ? (
          <>
            <label className="block font-semibold mt-3">Name:</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />

            <label className="block font-semibold mt-4">Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />

            <label className="block font-semibold mt-4">About Me:</label>
            <textarea
              name="aboutMe"
              value={profile.aboutMe}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />

            <button
              onClick={handleSave}
              className="mt-5 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p className="mb-2">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="mb-2">
              <strong>Birthday:</strong> {profile.birthday}
            </p>
            <p className="mb-4">
              <strong>About Me:</strong> {profile.aboutMe}
            </p>

            {editable && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-300 py-2 font-semibold rounded-md hover:bg-gray-400 transition"
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
