import React, { useCallback, useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaSearch, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=packageRating&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getLatestPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getOfferPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&offer=true&limit=6"
      );
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  return (
    <div className="main w-full">
      <div className="w-full flex flex-col">
        <div className="backaground_image w-full"></div>
        <div className="top-part w-full gap-2 flex flex-col">
          <h1 className="text-white text-5xl text-center font-extrabold tracking-tight mb-2 drop-shadow-lg">
            Dream Tours
          </h1>
          <h1 className="text-white text-lg text-center xsm:text-xl font-medium drop-shadow-md max-w-2xl mx-auto">
            Explore the world's most beautiful destinations with our curated travel packages.
          </h1>
          <div className="w-full flex justify-center items-center gap-2 mt-10">
            <input
              type="text"
              className="rounded-full outline-none w-[280px] sm:w-2/5 p-3 px-6 border border-white border-opacity-30 bg-white bg-opacity-20 backdrop-blur-md text-white placeholder:text-gray-200 font-semibold shadow-xl focus:bg-opacity-30 transition-all duration-300"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <button
              onClick={() => {
                navigate(`/search?searchTerm=${search}`);
              }}
              className="bg-white text-slate-800 w-12 h-12 flex justify-center items-center text-2xl font-bold rounded-full hover:scale-110 hover:bg-slate-100 transition-all duration-300 shadow-xl"
            >
              <FaSearch />
            </button>
          </div>
          <div className="w-[90%] max-w-2xl flex justify-center mt-12 backdrop-blur-sm bg-black bg-opacity-10 rounded-full p-1 shadow-2xl border border-white border-opacity-20">
            <button
              onClick={() => {
                navigate("/search?offer=true");
              }}
              className="flex items-center justify-center gap-x-2 text-white p-3 py-2 text-[10px] xxsm:text-sm sm:text-base font-semibold border-r border-white border-opacity-20 rounded-l-full flex-1 hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              Offers
              <LuBadgePercent className="text-xl" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=packageRating");
              }}
              className="flex items-center justify-center gap-x-2 text-white p-3 py-2 text-[10px] xxsm:text-sm sm:text-base font-semibold border-x border-white border-opacity-20 flex-1 hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              Top Rated
              <FaStar className="text-xl" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=createdAt");
              }}
              className="flex items-center justify-center gap-x-2 text-white p-3 py-2 text-[10px] xxsm:text-sm sm:text-base font-semibold border-x border-white border-opacity-20 flex-1 hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              Latest
              <FaCalendar className="text-lg" />
            </button>
            <button
              onClick={() => {
                navigate("/search?sort=packageTotalRatings");
              }}
              className="flex items-center justify-center gap-x-2 text-white p-3 py-2 text-[10px] xxsm:text-sm sm:text-base font-semibold border-l border-white border-opacity-20 rounded-r-full flex-1 hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              Most Rated
              <FaRankingStar className="text-xl" />
            </button>
          </div>
        </div>
        {/* main page */}
        <div className="main p-6 flex flex-col gap-5">
          {loading && <h1 className="text-center text-2xl">Loading...</h1>}
          {!loading &&
            topPackages.length === 0 &&
            latestPackages.length === 0 &&
            offerPackages.length === 0 && (
              <h1 className="text-center text-2xl">No Packages Yet!</h1>
            )}
          {/* Top Rated */}
          {!loading && topPackages.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Top Packages</h1>
              <div className="grid 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2 my-3">
                {topPackages.map((packageData, i) => {
                  return <PackageCard key={i} packageData={packageData} />;
                })}
              </div>
            </>
          )}
          {/* Top Rated */}
          {/* latest */}
          {!loading && latestPackages.length > 0 && (
            <>
              <h1 className="text-2xl font-semibold">Latest Packages</h1>
              <div className="grid 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2 my-3">
                {latestPackages.map((packageData, i) => {
                  return <PackageCard key={i} packageData={packageData} />;
                })}
              </div>
            </>
          )}
          {/* latest */}
          {/* offer */}
          {!loading && offerPackages.length > 0 && (
            <>
              <div className="offers_img"></div>
              <h1 className="text-2xl font-semibold">Best Offers</h1>
              <div className="grid 2xl:grid-cols-5 xlplus:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-2 my-3">
                {offerPackages.map((packageData, i) => {
                  return <PackageCard key={i} packageData={packageData} />;
                })}
              </div>
            </>
          )}
          {/* offer */}
        </div>
      </div>
    </div>
  );
};

export default Home;
