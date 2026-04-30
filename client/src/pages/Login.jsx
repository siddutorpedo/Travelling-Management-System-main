import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      dispatch(loginStart());
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        alert(data?.message);
        navigate("/");
      } else {
        dispatch(loginFailure(data?.message));
        alert(data?.message);
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col border border-white border-opacity-20 rounded-2xl p-8 w-80 h-fit gap-6 sm:w-[400px] bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl transition-all duration-300 hover:bg-opacity-15">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl text-center font-bold text-white tracking-tight">Login</h1>
            <p className="text-center text-gray-300 text-sm">Welcome back to Dream Tours</p>
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
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-white text-sm ml-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="p-3 rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <Link to="/signup" className="text-blue-400 text-sm hover:text-blue-300 hover:underline transition-colors duration-200">
              New here? Create account
            </Link>
          </div>
          <button
            disabled={loading}
            className="p-3 text-white bg-blue-600 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
          {error && (
            <div className="p-3 rounded-xl bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
