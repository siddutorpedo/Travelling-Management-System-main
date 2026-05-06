import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  // console.log(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        navigate("/login");
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen py-10"
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col border border-white border-opacity-20 rounded-2xl p-8 w-80 h-fit gap-4 sm:w-[450px] bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl transition-all duration-300 hover:bg-opacity-15">
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="text-4xl text-center font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-center text-gray-300 text-sm">Join Dream Tours and start your journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="font-medium text-white text-sm ml-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Choose a username"
                className="p-3 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-medium text-white text-sm ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="p-3 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-white text-sm ml-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create a strong password"
              className="p-3 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="font-medium text-white text-sm ml-1">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Your contact number"
              className="p-3 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="font-medium text-white text-sm ml-1">
              Address
            </label>
            <textarea
              maxLength={200}
              id="address"
              placeholder="Your permanent address"
              className="p-3 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none h-24"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between items-center px-1 mt-2">
            <Link to="/login" className="text-blue-400 text-sm hover:text-blue-300 hover:underline transition-colors duration-200">
              Already have an account? Login
            </Link>
          </div>
          <button
            className="p-3 mt-2 text-white bg-blue-600 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform active:scale-95 shadow-xl"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
