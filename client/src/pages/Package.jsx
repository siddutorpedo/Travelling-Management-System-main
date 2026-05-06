import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaShare,
  FaCheckCircle,
  FaHotel,
  FaBus,
  FaUtensils,
  FaHiking,
  FaInfoCircle
} from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";

const Package = () => {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: "",
  });

  useEffect(() => {
    if (currentUser) {
      setRatingsData(prev => ({
        ...prev,
        userRef: currentUser._id,
      }));
    }
  }, [currentUser]);
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) {
        setPackageData(data.package);
        setLoading(false);
      } else {
        setError(data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch package data");
      setLoading(false);
    }
  };

  const giveRating = async () => {
    if (ratingGiven) {
      alert("You already submitted your rating!");
      return;
    }
    if (ratingsData.rating === 0) {
      alert("Please provide a rating score!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/rating/give-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`/api/rating/get-ratings/${params.id}/10`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPackageRatings(data);
      } else {
        setPackageRatings([]);
      }
    } catch (error) {
      console.log(error);
      setPackageRatings([]);
    }
  };

  const checkRatingGiven = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(
        `/api/rating/rating-given/${currentUser?._id}/${params?.id}`
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser && currentUser.user_role !== 1) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  if (loading && !packageData.packageName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Preparing your adventure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-5">
        <div className="text-red-500 text-5xl mb-2">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h2>
        <p className="text-gray-500 text-center max-w-md">{error}</p>
        <Link className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg" to="/">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden group">
        <Swiper 
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="h-full w-full"
        >
          {packageData?.packageImages.length > 0 ? (
            packageData.packageImages.map((imageUrl, i) => (
              <SwiperSlide key={i}>
                <div
                  className="h-full w-full bg-center bg-no-repeat bg-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-10">
                    <div className="max-w-4xl">
                      <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg">
                        {packageData?.packageName}
                      </h1>
                      <div className="flex items-center gap-4 text-white font-medium">
                        <span className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-full border border-white border-opacity-30">
                          <FaMapMarkerAlt /> {packageData?.packageDestination}
                        </span>
                        {(+packageData?.packageDays > 0) && (
                          <span className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-full border border-white border-opacity-30">
                            <FaClock /> {packageData?.packageDays || 0} Days / {packageData?.packageNights || 0} Nights
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="h-full w-full bg-slate-800 flex items-center justify-center text-white italic">
                No images available for this package.
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {/* Custom Navigation */}
        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 rounded-full flex justify-center items-center text-white hover:bg-opacity-40 transition-all opacity-0 group-hover:opacity-100">
          <FaArrowLeft />
        </button>
        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 rounded-full flex justify-center items-center text-white hover:bg-opacity-40 transition-all opacity-0 group-hover:opacity-100">
          <FaArrowRight />
        </button>

        {/* Back and Share buttons */}
        <div className="absolute top-6 left-6 z-20 flex gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex justify-center items-center shadow-lg hover:scale-110 transition-transform text-gray-800"
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="absolute top-6 right-6 z-20 flex gap-4">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex justify-center items-center shadow-lg hover:scale-110 transition-transform text-gray-800 relative"
          >
            <FaShare />
            {copied && (
              <span className="absolute -bottom-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-500" /> Package Overview
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>
                {showFullDesc 
                  ? packageData?.packageDescription 
                  : `${(packageData?.packageDescription || "").substring(0, 350)}${(packageData?.packageDescription || "").length > 350 ? '...' : ''}`}
              </p>
              {(packageData?.packageDescription || "").length > 350 && (
                <button 
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  {showFullDesc ? "Show Less" : "Read Full Description"}
                </button>
              )}
            </div>

            {/* Quick Amenities */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
                  <FaHotel />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Stay</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{packageData.packageAccommodation || "Included"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-xl">
                  <FaBus />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Travel</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{packageData.packageTransportation || "Transport"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-xl">
                  <FaUtensils />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Meals</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{packageData.packageMeals || "Planned"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-xl">
                  <FaHiking />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Fun</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{packageData.packageActivities || "Activities"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Itinerary / Highlights */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Highlights</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                  <div className="w-0.5 h-full bg-gray-100 mt-2"></div>
                </div>
                <div className="pb-4">
                  <h4 className="font-bold text-gray-800">What's Included</h4>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaCheckCircle className="text-green-500 shrink-0" /> Professional Tour Guide
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaCheckCircle className="text-green-500 shrink-0" /> Premium Accommodation
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaCheckCircle className="text-green-500 shrink-0" /> All Entrance Fees
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Daily Program</h4>
                  <p className="mt-2 text-gray-600 text-sm italic">Detailed daily itinerary is provided upon booking confirmation.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Ratings & Reviews */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Traveler Feedback</h2>
              <div className="flex items-center gap-2">
                <Rating value={packageData?.packageRating || 0} readOnly precision={0.1} />
                <span className="font-bold text-gray-800">{(packageData?.packageRating || 0).toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({packageData?.packageTotalRatings || 0} reviews)</span>
              </div>
            </div>

            {/* Review Form */}
            {!ratingGiven && currentUser && currentUser.user_role !== 1 && (
              <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 text-center">Share your experience</h4>
                <div className="flex flex-col items-center gap-4">
                  <Rating
                    size="large"
                    value={ratingsData.rating}
                    onChange={(e, val) => setRatingsData({...ratingsData, rating: val})}
                  />
                  <textarea
                    className="w-full p-4 rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                    placeholder="Write your review here..."
                    rows={3}
                    value={ratingsData.review}
                    onChange={(e) => setRatingsData({...ratingsData, review: e.target.value})}
                  />
                  <button 
                    onClick={giveRating}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

            {currentUser?.user_role === 1 && (
              <div className="mb-10 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-sm text-amber-700 font-medium text-center">
                  Reviewing is reserved for customers. As an administrator, you can manage these reviews from the dashboard.
                </p>
              </div>
            )}

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingCard packageRatings={packageRatings} />
            </div>
            
            {packageData.packageTotalRatings > 4 && (
              <button 
                onClick={() => navigate(`/package/ratings/${params?.id}`)}
                className="w-full mt-6 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
              >
                View More Reviews <FaArrowRight />
              </button>
            )}
          </section>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Price starts at</p>
                  <div className="flex items-baseline gap-2">
                    {packageData.packageOffer ? (
                      <>
                        <span className="text-3xl font-black text-gray-800">₹{packageData.packageDiscountPrice}</span>
                        <span className="text-lg text-gray-400 line-through">₹{packageData.packagePrice}</span>
                      </>
                    ) : (
                    <span className="text-3xl font-black text-gray-800">₹{packageData.packagePrice}</span>
                    )}
                  </div>
                </div>
                {packageData.packageOffer && (
                  <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    {Math.floor(((packageData.packagePrice - packageData.packageDiscountPrice) / packageData.packagePrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {currentUser?.user_role === 1 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
                  <p className="text-xs text-amber-700 font-bold text-center italic">
                    Administrative accounts cannot book packages. Please log in with a traveler account to book.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <FaCheckCircle className="text-blue-500" />
                    <p className="text-xs font-bold text-gray-600">Free cancellation up to 48h</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <FaCheckCircle className="text-blue-500" />
                    <p className="text-xs font-bold text-gray-600">Secure payment via Braintree</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <FaCheckCircle className="text-blue-500" />
                    <p className="text-xs font-bold text-gray-600">Best price guaranteed</p>
                  </div>
                </div>
              )}

              <button 
                disabled={loading || currentUser?.user_role === 1}
                onClick={() => {
                  if (currentUser) {
                    navigate(`/booking/${params?.id}`);
                  } else {
                    navigate("/login");
                  }
                }}
                className={`w-full py-4 rounded-2xl text-lg font-black shadow-lg transform transition-all ${
                  currentUser?.user_role === 1 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                }`}
              >
                {currentUser?.user_role === 1 ? "Admin Access Only" : "Book This Experience"}
              </button>

              <button 
                onClick={() => window.open(`mailto:info@dreamtours.com?subject=Inquiry about ${packageData.packageName}`)}
                className="w-full mt-3 py-4 bg-white border-2 border-gray-100 text-gray-800 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all"
              >
                Inquire via Email
              </button>
            </div>

            {/* Need Help Card */}
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Need Assistance?</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">Our travel experts are available 24/7 to help you plan your dream trip.</p>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-lg font-bold hover:text-blue-400 transition-colors relative z-10">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Package;
