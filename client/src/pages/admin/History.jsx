import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineTrash, HiOutlineClock, HiOutlineExclamationCircle } from "react-icons/hi";

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/get-allBookings?searchTerm=${search}`);
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
        setError(false);
      } else {
        setError(data?.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  const handleHistoryDelete = async (id) => {
    if (!window.confirm("Permanent delete this history record?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/delete-booking-history/${id}/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        getAllBookings();
      } else {
        alert(data?.message || "Delete failed");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Activity History</h2>
          <p className="page-subtitle">Review completed and cancelled travel records from the archive.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="relative min-w-[350px]">
             <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-primary transition-all"
              type="text"
              placeholder="Filter history records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking Reference</th>
                  <th>Client</th>
                  <th>Itinerary</th>
                  <th>Date</th>
                  <th>Final Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-12">Retrieving archives...</td></tr>
                ) : (
                  allBookings.map((booking, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs text-gray-400 uppercase">#HIS-{booking?._id.substring(18)}</td>
                      <td>
                        <span className="font-bold text-gray-800">{booking?.buyer?.username}</span>
                      </td>
                      <td>
                        <span className="text-xs font-medium text-gray-600 line-clamp-1">{booking?.packageDetails?.packageName}</span>
                      </td>
                      <td className="text-xs text-gray-500">{new Date(booking?.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${booking.status === "Cancelled" ? "status-cancelled" : "status-confirmed"}`}>
                          {booking.status === "Cancelled" ? "Cancelled" : "Completed"}
                        </span>
                      </td>
                      <td>
                        {(new Date(booking?.date).getTime() < new Date().getTime() || booking?.status === "Cancelled") && (
                          <button
                            onClick={() => handleHistoryDelete(booking._id)}
                            className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                            title="Delete from history"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {!loading && allBookings.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-500">No archived records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;

