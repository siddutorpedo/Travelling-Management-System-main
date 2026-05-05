import React from "react";
import { HiOutlineViewGrid, HiOutlineTicket, HiOutlineLocationMarker, HiOutlineUsers, HiOutlineCog, HiOutlineSupport, HiPlusCircle, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineLogout } from "react-icons/hi";
import { Link } from "react-router-dom";

const AdminSidebar = ({ activePanelId, setActivePanelId, handleLogout }) => {
  const menuItems = [
    { id: 1, label: "Dashboard", icon: <HiOutlineViewGrid />, panelId: 1 },
    { id: 2, label: "Bookings", icon: <HiOutlineTicket />, panelId: 9 },
    { id: 3, label: "Destinations", icon: <HiOutlineLocationMarker />, panelId: 3 },
    { id: 4, label: "Customers", icon: <HiOutlineUsers />, panelId: 4 },
    { id: 7, label: "Payments", icon: <HiOutlineCurrencyDollar />, panelId: 5 },
    { id: 8, label: "History", icon: <HiOutlineClock />, panelId: 7 },
  ];

  const bottomItems = [
    { id: 5, label: "Settings", icon: <HiOutlineCog />, panelId: 8 },
    { id: 6, label: "Support", icon: <HiOutlineSupport />, panelId: 6 },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <h1>VoyageAdmin</h1>
        <p>Corporate Travel Portal</p>
      </div>

      <div className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activePanelId === item.panelId ? "active" : ""}`}
            onClick={() => setActivePanelId(item.panelId)}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="new-booking-btn" onClick={() => setActivePanelId(2)}>
          <HiPlusCircle className="text-xl" />
          <span>New Booking</span>
        </button>
        
        <div className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePanelId === item.panelId ? "active" : ""}`}
              onClick={() => setActivePanelId(item.panelId)}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          
          <div className="nav-item text-rose-400 hover:!bg-rose-500/10 hover:!text-rose-400 mt-2" onClick={handleLogout}>
            <span className="text-xl"><HiOutlineLogout /></span>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
