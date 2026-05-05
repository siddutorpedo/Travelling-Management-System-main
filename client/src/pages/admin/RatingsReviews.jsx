import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineStar, HiOutlineChatAlt2, HiOutlineExternalLink } from "react-icons/hi";

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    try {
      setLoading(true);
      let url =
        filter === "most"
          ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
          : `/api/package/get-packages?searchTerm=${search}&sort=packageRating`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
      setShowMoreBtn(data?.packages?.length > 8);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "most"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  return (
    <div className="w-full">
      <div className="page-header">
        <div>
          <h2 className="page-title">Ratings & Feedback</h2>
          <p className="page-subtitle">Monitor customer satisfaction and review destination performance.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['all', 'most'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  filter === f 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {f === 'all' ? 'Highest Rated' : 'Most Reviews'}
              </button>
            ))}
          </div>
          <div className="relative min-w-[300px]">
             <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:border-primary transition-all"
              type="text"
              placeholder="Search packages..."
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
                  <th>Package Details</th>
                  <th>Average Rating</th>
                  <th>Total Reviews</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-12">Loading feedback data...</td></tr>
                ) : (
                  packages.map((pack, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={pack?.packageImages[0]}
                            alt="image"
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          />
                          <div>
                            <span className="font-bold block text-gray-800">{pack?.packageName}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{pack?.packageDestination}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Rating
                            value={pack?.packageRating}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                          <span className="font-bold text-gray-700">{pack?.packageRating}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-gray-500">
                          <HiOutlineChatAlt2 />
                          <span className="font-medium">{pack?.packageTotalRatings} Reviews</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                            <span>Score</span>
                            <span>{Math.round((pack.packageRating / 5) * 100)}%</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${pack.packageRating >= 4 ? 'bg-emerald-500' : pack.packageRating >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                              style={{ width: `${(pack.packageRating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link 
                          to={`/package/ratings/${pack._id}`}
                          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          Details <HiOutlineExternalLink />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
                {packages.length === 0 && !loading && (
                  <tr><td colSpan="5" className="text-center py-12 text-gray-500">No ratings data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showMoreBtn && (
          <div className="flex justify-center">
            <button
              onClick={onShowMoreSClick}
              className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Load More Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsReviews;

