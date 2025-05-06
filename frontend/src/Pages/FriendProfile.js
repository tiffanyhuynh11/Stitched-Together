import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Profile from "../Components/Profile"

function FriendProfile() {
  const { friendId } = useParams(); // Get ID from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/friend/${friendId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched profile data:", data);
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch profile.");
        setLoading(false);
      });
  }, [friendId]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {profile ? <Profile key={profile.id} data={profile} editable={true} friendId={friendId} deletable={true} /> : <p>No profile data found</p>}
    </div>
  );
};

export default FriendProfile;
