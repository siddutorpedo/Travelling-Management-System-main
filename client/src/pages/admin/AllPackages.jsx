import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlus, HiOutlineFilter, HiOutlineChartBar, HiOutlineCurrencyDollar } from "react-icons/hi";

const AllPackages = ({ stats, statsLoading, setActivePanelId }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    try {
      setLoading(true);
      let url =
        filter === "offer"
          ? `/api/package/get-packages?searchTerm=${search}&offer=true`
          : filter === "latest"
          ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt`
          : filter === "top"
          ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating`
          : `/api/package/get-packages?searchTerm=${search}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
      if (data?.packages?.length > 8) {
        setShowMoreBtn(true);
      } else {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "offer"
        ? `/api/package/get-packages?searchTerm=${search}&offer=true&startIndex=${startIndex}`
        : filter === "latest"
        ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const handleDelete = async (packageId) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/package/delete-package/${packageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data?.message);
      getPackages();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex gap-8">
      {/* Categories Sidebar */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
        <div className="admin-card p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Categories</h3>
          <div className="flex flex-col gap-1">
            {[
              { label: "International", count: 24, id: "international" },
              { label: "Domestic", count: 12, id: "domestic" },
              { label: "Luxury", count: 8, id: "luxury" },
              { label: "Adventure", count: 15, id: "adventure" },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat.id === "luxury" ? "bg-emerald-50 text-emerald-600 font-bold" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cat.id === "luxury" ? "bg-emerald-100" : "bg-gray-100 text-gray-400"}`}>
                  {cat.count.toString().padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold text-sm mb-2">Winter Season is Here!</h4>
            <p className="text-[10px] text-gray-300 mb-4">Promote your winter destinations with targeted Q4 campaigns.</p>
            <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/20">
              Create Campaign
            </button>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="admin-card p-6 flex justify-between items-center relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Active Packages</p>
              <p className="text-3xl font-bold text-gray-800">{packages.length}</p>
              <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                <span className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center text-[8px]">↑</span> 
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl group-hover:scale-110 transition-transform">
              <HiOutlineChartBar />
            </div>
          </div>
          <div className="admin-card p-6 flex justify-between items-center group">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">${statsLoading ? "..." : stats?.totalRevenue?.toLocaleString() || 0}</p>
              <p className="text-[10px] text-blue-500 font-bold mt-1 flex items-center gap-1">
                <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-[8px]">↑</span> 
                On track for Q4
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-transform">
              <HiOutlineCurrencyDollar />
            </div>
          </div>
        </div>

        {/* Filter and Search row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['all', 'offer', 'latest', 'top'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  filter === f 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {f === 'top' ? 'Top Rated' : f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <HiOutlineFilter />
              <span>Filters</span>
            </button>
            <button onClick={() => setActivePanelId(2)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-600/10">
              <HiOutlinePlus />
              <span>New Package</span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400 font-medium">Loading catalog...</div>
          ) : (
            <>
              {packages.map((pack) => (
                <div key={pack._id} className="admin-card group overflow-hidden flex flex-col h-full bg-white hover:shadow-2xl transition-all duration-500 border-transparent hover:border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pack?.packageImages[0]}
                      alt={pack.packageName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold rounded shadow-sm uppercase tracking-wider">Luxury</span>
                      <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded shadow-sm uppercase tracking-wider">Available</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">{pack.packageName}</h3>
                      <span className="text-emerald-600 font-bold">₹{pack?.packagePrice?.toLocaleString() || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-6 h-8">
                      {pack.packageDescription || "Enjoy a premium travel experience with our curated packages."}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                         <div className="flex -space-x-2">
                          {[1,2].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="avatar" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold ml-1">+12</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Link to={`/admin/update-package/${pack._id}`} className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg transition-colors">
                          <HiOutlinePencilAlt className="text-lg" />
                        </Link>
                        <button onClick={() => handleDelete(pack._id)} className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-lg transition-colors">
                          <HiOutlineTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Package Card */}
              <div onClick={() => setActivePanelId(2)} className="admin-card border-dashed border-2 border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center p-8 text-center group hover:border-emerald-500 hover:bg-white transition-all cursor-pointer min-h-[300px]">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors mb-4 group-hover:rotate-90 duration-500">
                  <HiOutlinePlus className="text-3xl" />
                </div>
                <h4 className="font-bold text-gray-600 group-hover:text-emerald-500 transition-colors">Add New Package</h4>
                <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Create Itinerary</p>
              </div>
            </>
          )}
        </div>

        {showMoreBtn && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onShowMoreSClick}
              className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            >
              Discover More Packages
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default AllPackages;

