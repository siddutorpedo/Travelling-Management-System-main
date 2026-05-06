import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Hide header on login and signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <>
      <div className="bg-slate-900 bg-opacity-90 backdrop-blur-md p-4 px-8 flex justify-between items-center sticky top-0 z-50 border-b border-white border-opacity-10 shadow-lg">
        <Link to="/" className="flex items-center gap-2">
          <h1
            className="text-3xl font-extrabold tracking-tighter text-white"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Dream<span className="text-blue-500 text-4xl">Tours</span>
          </h1>
        </Link>
        <ul className="flex flex-wrap items-center justify-end gap-6 text-gray-300 font-semibold list-none">
          <li className="hover:text-white transition-all duration-300 transform hover:scale-105">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-white transition-all duration-300 transform hover:scale-105">
            <Link to="/search">Packages</Link>
          </li>
          <li className="hover:text-white transition-all duration-300 transform hover:scale-105">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-blue-400 transition-all duration-300 transform hover:scale-105 font-bold border-l border-white border-opacity-10 pl-4">
            <Link to="/admin">Admin</Link>
          </li>
          <li className="flex items-center justify-center ml-2">
            {currentUser ? (
              <Link
                to={currentUser.user_role === 1 ? "/admin" : "/profile"}
                className="hover:scale-110 transition-transform duration-300"
              >
                <img
                  src={currentUser.avatar || defaultProfileImg}
                  alt={currentUser.username}
                  className="w-10 h-10 border-2 border-blue-500 rounded-full object-cover shadow-md"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
