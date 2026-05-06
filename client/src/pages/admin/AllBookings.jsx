import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Chart from "../components/Chart";
import { HiOutlineDownload, HiOutlineFilter, HiOutlineDotsVertical } from "react-icons/hi";

const AllBookings = ({ dashboardView = false, stats, statsLoading, refreshStats }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const endpoint = dashboardView ? "/api/booking/get-currentBookings" : "/api/booking/get-allBookings";
      const res = await fetch(
        `${endpoint}?searchTerm=${searchTerm}&status=${statusFilter}&destination=${destinationFilter}`
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings || []);
        setError(false);
      } else {
        setCurrentBookings([]);
        setError(data?.message || false);
      }
    } catch (error) {
      console.log(error);
      setCurrentBookings([]);
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm, statusFilter, destinationFilter]);

  const handleExport = () => {
    if (!currentBookings.length) return alert("No records to export!");
    const headers = ["Booking ID", "Customer", "Email", "Destination", "Date", "Status", "Amount"];
    const rows = currentBookings.map(b => [
      `VA-${b._id.substring(18).toUpperCase()}`,
      b.buyer?.username,
      b.buyer?.email,
      b.packageDetails?.packageName,
      new Date(b.date).toLocaleDateString(),
      b.status,
      `₹${b.packageDetails?.packagePrice}`
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_bookings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings();
        if (refreshStats) refreshStats();
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Mark this trip as completed?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/complete-booking/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings();
        if (refreshStats) refreshStats();
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (dashboardView) {
    return (
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Traveler</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.slice(0, 5).map((booking, i) => (
              <tr key={i}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {booking?.buyer?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold block">{booking?.buyer?.username}</span>
                      <span className="text-xs text-gray-500">{booking?.buyer?.email}</span>
                    </div>
                  </div>
                </td>
                <td>{booking?.packageDetails?.packageName}</td>
                <td>{new Date(booking?.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${booking.status === "Booked" ? "status-confirmed" : booking.status === "Cancelled" ? "status-cancelled" : booking.status === "Completed" ? "status-completed" : "status-pending"}`}>
                    {booking.status}
                  </span>
                </td>
                 <td className="font-bold">₹{booking?.totalPrice?.toLocaleString() || booking?.packageDetails?.packagePrice || '—'}</td>
              </tr>
            ))}
            {currentBookings.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-wrap">
             <div className="relative min-w-[200px]">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Booking Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-primary cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Booked</option>
                <option>Pending</option>
                <option>Cancelled</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="relative min-w-[200px]">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Destination</label>
              <input
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                type="text"
                placeholder="Filter by Destination"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
              />
            </div>
            <div className="relative min-w-[200px]">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Search (Username/Email)</label>
              <input
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                type="text"
                placeholder="Search Username or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 self-end">
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <HiOutlineDownload />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="admin-card overflow-hidden">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Name</th>
                  <th>Destination</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-12">Loading bookings...</td></tr>
                ) : (
                  currentBookings.map((booking, i) => (
                    <tr key={i}>
                      <td className="font-mono text-gray-500">#VA-{booking._id.substring(18).toUpperCase()}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {booking?.buyer?.username?.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{booking?.buyer?.username}</span>
                        </div>
                      </td>
                      <td>{booking?.packageDetails?.packageName}</td>
                      <td>{new Date(booking?.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${booking.status === "Booked" ? "status-confirmed" : booking.status === "Cancelled" ? "status-cancelled" : booking.status === "Completed" ? "status-completed" : "status-pending"}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="font-bold">₹{booking?.totalPrice?.toLocaleString() || booking?.packageDetails?.packagePrice || '—'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {booking.status === "Booked" && (
                            <button 
                              onClick={() => handleComplete(booking._id)}
                              className="text-xs font-bold text-emerald-600 hover:underline"
                            >
                              Complete
                            </button>
                          )}
                           <button 
                            onClick={() => handleCancel(booking._id)}
                            className="text-xs font-bold text-rose-600 hover:underline disabled:opacity-50"
                            disabled={booking.status === "Cancelled" || booking.status === "Completed"}
                          >
                            Cancel
                          </button>
                          <HiOutlineDotsVertical className="text-gray-400 cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {currentBookings.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500">No bookings found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-xs text-gray-500 font-medium">Showing {currentBookings.length} bookings</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded bg-white text-xs font-bold hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-primary text-white rounded text-xs font-bold">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded bg-white text-xs font-bold hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {/* Stats Section below table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="admin-card p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Confirmed Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{statsLoading ? "..." : stats?.totalBookings || 0}</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ 12.4% from last month</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <HiOutlineDownload />
              </div>
           </div>
           <div className="admin-card p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-800">{statsLoading ? "..." : stats?.pendingRequests || 0}</p>
                <p className="text-[10px] text-amber-500 font-bold mt-1">Requires urgent review</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                <HiOutlineFilter />
              </div>
           </div>
           <div className="admin-card p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Revenue Projected</p>
                 <p className="text-2xl font-bold text-gray-800">₹{statsLoading ? "..." : stats?.totalRevenue?.toLocaleString() || 0}</p>
                <p className="text-[10px] text-blue-500 font-bold mt-1">On track for Q4 goal</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <HiOutlineDownload />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;


