import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineCurrencyDollar, HiOutlineDownload, HiOutlineCheckCircle } from "react-icons/hi";

const Payments = () => {
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

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Financial Records</h2>
          <p className="page-subtitle">Track payments, revenue, and transaction history across the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <HiOutlineDownload />
          <span>Download Statement</span>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="relative min-w-[350px]">
             <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-primary transition-all"
              type="text"
              placeholder="Search by customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Volume:</span>
            <span className="text-lg font-bold text-gray-800">${allBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-12">Loading transactions...</td></tr>
                ) : (
                  allBookings.map((booking, i) => (
                    <tr key={i}>
                      <td className="font-mono text-xs text-gray-400 uppercase">#TXN-{booking?._id.substring(18)}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{booking?.buyer?.username}</span>
                          <span className="text-[10px] text-gray-400">{booking?.buyer?.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                           <img
                            src={booking?.packageDetails?.packageImages[0]}
                            className="w-8 h-8 rounded object-cover shadow-sm"
                            alt="pkg"
                          />
                          <span className="text-xs font-medium text-gray-600 truncate max-w-[150px]">{booking?.packageDetails?.packageName}</span>
                        </div>
                      </td>
                      <td className="text-xs text-gray-500">{new Date(booking?.date).toLocaleDateString()}</td>
                      <td className="font-bold text-gray-800">${booking?.totalPrice?.toLocaleString()}</td>
                      <td>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-500">
                          <HiOutlineCheckCircle />
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && allBookings.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-500">No payment records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

