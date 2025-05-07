import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-peach-500 to-peach-100 flex flex-col justify-center items-center px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full text-center">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Stitched-Together</h1>
                <p className="text-lg text-gray-600 mb-6">
                    A place to build up your friendship network! Track your friends' birthdays, gifts ideas, and preferences.
                </p>
                {/*Goes to the user's profile */}
                <button
                    onClick={() => navigate('/profile')}
                    className="mt-4 px-6 py-3 bg-peach-200 text-black rounded-md font-semibold text-lg hover:bg-peach-400 transition"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Home;
