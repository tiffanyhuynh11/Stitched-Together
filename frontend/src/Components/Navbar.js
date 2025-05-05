import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-orange-300 shadow-md px-6 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-white hover:text-red-400 transition"
      >
        Stitched-Together
      </Link>

      <div className="flex gap-4">
        <Link
          to="/my-stitches"
          className="text-white font-medium hover:text-red-400 transition"
        >
          Friends
        </Link>
        <Link
          to="/profile"
          className="text-white font-medium hover:text-red-400 transition"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
