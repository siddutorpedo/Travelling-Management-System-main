import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCamera } from "react-icons/hi";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";

const AdminUpdateProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      alert("Change at least 1 field to update details");
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(updateUserFailure(data?.message));
        alert(data?.message || "Update failed");
        return;
      }
      alert(data?.message);
      dispatch(updateUserSuccess(data?.user));
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure("Something went wrong"));
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (!updatePassword.oldpassword || !updatePassword.newpassword) {
      alert("Enter a valid password");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      alert("New password can't be the same!");
      return;
    }
    try {
      dispatch(updatePassStart());
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(updatePassFailure(data?.message));
        alert(data?.message || "Password update failed");
        return;
      }
      dispatch(updatePassSuccess());
      alert(data?.message);
      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
    } catch (error) {
      console.log(error);
      dispatch(updatePassFailure("Something went wrong"));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="page-header mb-8">
        <div>
          <h2 className="page-title">Account Settings</h2>
          <p className="page-subtitle">Manage your personal information and security preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar for Tabs */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === "profile" 
                ? "bg-slate-900 text-white shadow-lg" 
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <HiOutlineUser className="text-lg" />
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === "password" 
                ? "bg-slate-900 text-white shadow-lg" 
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <HiOutlineLockClosed className="text-lg" />
            Security
          </button>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3">
          <div className="admin-card p-8">
            {activeTab === "profile" ? (
              <form onSubmit={updateUserDetails} className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                   <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-gray-100">
                      <img 
                        src={formData.avatar || "https://i.pravatar.cc/300"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all">
                      <HiOutlineCamera />
                    </button>
                  </div>
                  <h3 className="mt-4 font-bold text-gray-800">{currentUser?.username}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">System Administrator</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                    <div className="relative">
                      <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="username"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2 bg-gray-200 border border-transparent rounded-lg text-sm text-gray-500 cursor-not-allowed"
                        value={currentUser?.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="phone"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Office Address</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    disabled={loading}
                    type="submit"
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={updateUserPassword} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-800">Security & Password</h3>
                  <p className="text-xs text-gray-500">Update your account password to maintain security.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="oldpassword"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={updatePassword.oldpassword}
                        onChange={handlePass}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                    <div className="relative">
                      <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="newpassword"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={updatePassword.newpassword}
                        onChange={handlePass}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    disabled={loading}
                    type="submit"
                    className="px-6 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-all shadow-md"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateProfile;

