import { HiOutlineSearch, HiOutlineBell, HiOutlineChatAlt, HiOutlineQuestionMarkCircle, HiOutlineLogout } from "react-icons/hi";
import { useSelector } from "react-redux";

const AdminHeader = ({ handleLogout }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="admin-header">
      <div className="header-search">
        <HiOutlineSearch />
        <input type="text" placeholder="Search bookings, IDs, or customers..." />
      </div>

      <div className="header-actions">
        <div className="flex items-center gap-4 border-r border-gray-200 pr-4">
          <div className="action-icon">
            <HiOutlineBell className="text-xl" />
            <span className="notification-dot"></span>
          </div>
          <div className="action-icon">
            <HiOutlineChatAlt className="text-xl" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            <HiOutlineLogout className="text-lg" />
            <span>Sign Out</span>
          </button>
          
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{currentUser?.username || "Admin"}</span>
              <span className="user-role">Global Admin</span>
            </div>
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt="User" 
              className="user-avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
