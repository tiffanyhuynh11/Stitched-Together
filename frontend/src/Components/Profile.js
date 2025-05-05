import React, { useState } from 'react';

const Profile = ({ data, editable = false, onSave }) => {
  const [profile, setProfile] = useState(data);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!profile.name) {  // ensure there is a name
      alert("Name and birthday cannot be empty!");
      return;
    }

    setIsEditing(false);

    fetch("/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then(response => response.json())
      .then(updatedProfile => setProfile(updatedProfile)) // Update state
      .catch(error => console.error("Error updating profile:", error));
    onSave && onSave(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-peach-500">
          {editable ? 'Your Profile' : `${data.name}'s Profile`}
        </h2>

        {editable && isEditing ? (
          <>
            <label className="block font-medium mt-4 text-peach-500">Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-peach-500 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
            />

            <label className="block font-medium mt-4 text-peach-500">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={profile.birthday}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-peach-500 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
            />

            <label className="block font-medium mt-4 text-peach-500">Notes</label>
            <textarea
              name="notes"
              value={profile.notes}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-peach-500 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
            />

            <button
              onClick={handleSave}
              className="mt-6 w-full bg-peach-500 text-white font-semibold py-2 rounded-md hover:bg-peach-500 transition"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              <strong className="text-peach-500">Name:</strong> {profile.name}
            </p>
            <p className="mb-4 text-gray-700">
              <strong className="text-peach-500">Birthday:</strong> {profile.birthday}
            </p>
            <p className="mb-6 text-gray-700">
              <strong className="text-peach-500">Notes:</strong> {profile.notes}
            </p>

            {editable && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-peach-500 text-white py-2 font-semibold rounded-md hover:bg-red-400 transition"
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
