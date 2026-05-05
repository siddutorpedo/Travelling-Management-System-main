import React, { useEffect, useState } from "react";
import { HiOutlineTrash, HiOutlineSearch, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getAllUsers?searchTerm=${search}`);
      const data = await res.json();

      if (data && data?.success === false) {
        setLoading(false);
        setError(data?.message);
      } else {
        setLoading(false);
        setAllUsers(data);
        setError(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [search]);

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Are you sure? This account will be permanently deleted!")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/user/delete-user/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.success === false) {
        setLoading(false);
        alert("Something went wrong!");
        return;
      }
      setLoading(false);
      alert(data?.message);
      getUsers();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Customer Management</h2>
          <p className="page-subtitle">Manage your registered users and their details.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="relative min-w-[300px]">
             <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:border-primary transition-all"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="text-sm font-medium text-gray-500">
            Total Customers: <span className="text-gray-900 font-bold">{allUser.length}</span>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact Info</th>
                  <th>Address</th>
                  <th>ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-12">Loading users...</td></tr>
                ) : (
                  allUser.map((user, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm uppercase">
                            {user.username?.substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold block text-gray-800">{user.username}</span>
                            <span className="text-xs text-emerald-600 font-medium capitalize">Active Customer</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <HiOutlineMail className="text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <HiOutlinePhone className="text-gray-400" />
                            {user.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[200px] truncate text-gray-600">{user.address || 'N/A'}</td>
                      <td className="font-mono text-[10px] text-gray-400 uppercase">{user._id.substring(18)}</td>
                      <td>
                        <button
                          disabled={loading}
                          className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                          onClick={() => handleUserDelete(user._id)}
                        >
                          <HiOutlineTrash className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {allUser.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">No users found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

