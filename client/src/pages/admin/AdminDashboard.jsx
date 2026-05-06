import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import { HiOutlineChartBar, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineClock, HiOutlineDownload, HiPlusCircle, HiOutlineLogout } from "react-icons/hi";

// New Components
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import "./styles/AdminLayout.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading: userLoading, error } = useSelector((state) => state.user);
  const [activePanelId, setActivePanelId] = useState(1);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    // If not admin, redirect
    if (!currentUser || currentUser.user_role !== 1) {
      navigate("/login");
    } else {
      fetchStats();
    }
  }, [currentUser, navigate]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
      setStatsLoading(false);
    } catch (error) {
      console.log(error);
      setStatsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(logOutFailure(data.message));
        return;
      }
      dispatch(logOutSuccess(data));
      navigate("/login");
    } catch (error) {
      dispatch(logOutFailure(error.message));
    }
  };

  const renderContent = () => {
    switch (activePanelId) {
      case 1:
        return (
          <div className="w-full">
            <div className="page-header">
              <div>
                <h2 className="page-title">Travel Overview</h2>
                <p className="page-subtitle">Welcome back, {currentUser?.username}. Here's what's happening today.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={fetchStats}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <span>{statsLoading ? "Refreshing..." : "Refresh Stats"}</span>
                </button>
                <button 
                  onClick={() => {
                    if (!stats?.totalBookings) return alert("No records to export!");
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + "Stat,Value\n"
                      + `Total Bookings,${stats.totalBookings}\n`
                      + `Total Revenue,${stats.totalRevenue}\n`
                      + `Active Travelers,${stats.activeTravelers}\n`
                      + `Pending Requests,${stats.pendingRequests}`;
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "travel_report.csv");
                    document.body.appendChild(link);
                    link.click();
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <span>Export Report</span>
                </button>
              </div>
            </div>

            <div className="stats-grid">
              <div className="admin-card stat-card">
                <div className="stat-info">
                  <h3>Total Bookings</h3>
                  <div className="stat-value">{statsLoading ? "..." : stats?.totalBookings || 0}</div>
                  <div className="stat-trend trend-up">
                    <span className="font-medium">+12.5%</span> from last month
                  </div>
                </div>
                <div className="stat-icon bg-emerald-50 text-emerald-500">
                  <HiOutlineChartBar className="text-2xl" />
                </div>
              </div>
              <div className="admin-card stat-card">
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <div className="stat-value">${statsLoading ? "..." : stats?.totalRevenue?.toLocaleString() || 0}</div>
                  <div className="stat-trend trend-up">
                    <span className="font-medium">+8.2%</span> from last month
                  </div>
                </div>
                <div className="stat-icon bg-blue-50 text-blue-500">
                  <HiOutlineCurrencyDollar className="text-2xl" />
                </div>
              </div>
              <div className="admin-card stat-card">
                <div className="stat-info">
                  <h3>Active Travelers</h3>
                  <div className="stat-value">{statsLoading ? "..." : stats?.activeTravelers || 0}</div>
                  <div className="stat-trend trend-up">
                    <span className="font-medium">+4.1%</span> from last month
                  </div>
                </div>
                <div className="stat-icon bg-purple-50 text-purple-500">
                  <HiOutlineUsers className="text-2xl" />
                </div>
              </div>
              <div className="admin-card stat-card">
                <div className="stat-info">
                  <h3>Pending Requests</h3>
                  <div className="stat-value">{statsLoading ? "..." : stats?.pendingRequests || 0}</div>
                  {stats?.pendingRequests > 0 && (
                    <div className="text-xs text-rose-500 mt-2 font-medium pulse-animation">Action Required</div>
                  )}
                </div>
                <div className="stat-icon bg-orange-50 text-orange-500">
                  <HiOutlineClock className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 admin-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Recent Bookings</h3>
                  <button onClick={() => setActivePanelId(9)} className="text-primary text-sm font-medium hover:underline">View All Bookings</button>
                </div>
                <AllBookings dashboardView={true} stats={stats} statsLoading={statsLoading} />
              </div>
              <div className="admin-card p-6">
                <h3 className="text-lg font-bold mb-6">Top Destinations</h3>
                <div className="flex flex-col gap-4">
                  {statsLoading ? (
                    <p className="text-center py-4 text-gray-400">Loading destinations...</p>
                  ) : (
                    stats?.topDestinations?.length > 0 ? (
                      stats.topDestinations.map((dest, i) => (
                        <div key={i} className="flex flex-col gap-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{dest.name}</span>
                            <span>{dest.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`bg-primary h-full`} style={{ width: `${dest.percentage}%` }}></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-400 text-sm">No destination data yet</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return <AddPackages />;
      case 3:
        return (
          <div className="w-full">
             <div className="page-header">
              <div>
                <h2 className="page-title">Luxury Catalog</h2>
                <p className="page-subtitle">Manage corporate travel packages and destination visibility.</p>
              </div>
              <button onClick={() => setActivePanelId(2)} className="new-booking-btn !mb-0 !w-auto !px-6">
                <span>Add New Package</span>
              </button>
            </div>
            <AllPackages stats={stats} statsLoading={statsLoading} setActivePanelId={setActivePanelId} />
          </div>
        );
      case 4:
        return <AllUsers />;
      case 5:
        return <Payments />;
      case 6:
        return <RatingsReviews />;
      case 7:
        return <History />;
      case 8:
        return <AdminUpdateProfile />;
      case 9:
        return (
          <div className="w-full">
            <div className="page-header">
              <div>
                <h2 className="page-title">Booking Management</h2>
                <p className="page-subtitle">Review and manage corporate travel arrangements across all regions.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActivePanelId(2)} className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent-hover transition-colors flex items-center gap-2">
                  <HiPlusCircle />
                  <span>Add New Booking</span>
                </button>
              </div>
            </div>
            <AllBookings stats={stats} statsLoading={statsLoading} refreshStats={fetchStats} />
          </div>
        );
      default:
        return <div>Page Not Found!</div>;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activePanelId={activePanelId} setActivePanelId={setActivePanelId} handleLogout={handleLogout} />
      
      <div className="admin-main">
        <AdminHeader handleLogout={handleLogout} />
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


