import React from "react";
import FriendsGraph from "../Components/FriendsGraph"
import { useNavigate } from 'react-router-dom';

function Stitches() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-blue-50 relative">
            <h1 className="text-center text-2xl font-bold py-4 text-peach-500">Your Friends</h1>
            <FriendsGraph />

            <button
                onClick={() => navigate('/new-friend')}
                className="fixed bottom-6 right-6 bg-peach-500 hover:bg-peach-400 text-white font-bold py-3 px-6 rounded-full shadow-lg transition"
            >
                + Add Friend
            </button>
        </div>
    );
};

export default Stitches;
