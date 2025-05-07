import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ data, editable = true, friendId, self = false, add = false, deletable }) => {
    const [profile, setProfile] = useState(data);
    const [isEditing, setIsEditing] = useState(add);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault(); // Prevent unintended GET requests
        if (!profile.name) {
            alert("Name cannot be empty!");
            return;
        }
    
        setIsEditing(false);
    
        const url = add ? "/new-friend" : friendId ? `/friend/${friendId}` : "/profile";
        const profileToSend = add ? profile : (({ relationship, ...rest }) => rest)(profile);

    
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileToSend),
        })
        .then(response => response.json())
        .then(updatedProfile => {
            setProfile(prev => ({
                ...prev,
                ...updatedProfile,
                relationship: prev.relationship
            }));
    
            if (add) {
                navigate('/my-stitches');
            }
        })
        .catch(error => console.error("Error updating profile:", error));
    };
    
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Sure you want to remove your friend?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/friend/${friendId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Profile deleted successfully.");
        navigate('/my-stitches'); // Redirect after removal
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Something went wrong. Please try again.");
    }
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-peach-500">
                    {self ? 'Your Profile' : `${data.name}'s Profile`}
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
                            max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
                            value={profile.birthday}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-peach-500 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                        />
                        {!self && (
                            <>
                                <label className="block font-medium mt-4 text-peach-500">Relationship</label>
                                <input
                                    name="relationship"
                                    value={profile.connection}
                                    onChange={handleChange}
                                    className="w-full p-2 mt-1 border border-peach-500 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                                />
                            </>
                        )}

                        <label className="block font-medium mt-4 text-peach-500">Significant Other</label>
                        <input
                            name="so"
                            value={profile.so}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-peach-500 rounded-md focus:outline-none focus:ring-2 focus:ring-peach-500"
                        />

                        <label className="block font-medium mt-4 text-peach-500">Gifts</label>
                        <input
                            name="gifts"
                            value={profile.gifts}
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
                        {!self && (
                            <p className="mb-4 text-gray-700">
                                <strong className="text-peach-500">Relationship:</strong> {profile.connection}
                            </p>
                        )}

                        <p className="mb-4 text-gray-700">
                            <strong className="text-peach-500">Significant Other:</strong> {profile.so}
                        </p>
                        <p className="mb-4 text-gray-700">
                            <strong className="text-peach-500">Gifts:</strong> {profile.gifts}
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
                {deletable && (
                  <button
                    onClick={() => handleDelete(friendId)}
                    className="w-full bg-peach-500 text-white py-2 font-semibold rounded-md hover:bg-red-400 mt-2 transition"
                  >
                    Delete Profile
                  </button>
                )}

                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
