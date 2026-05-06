import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt, FaCreditCard, FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.user_role === 1) {
      alert("Admins cannot book packages!");
      navigate("/admin");
    }
  }, [currentUser, navigate]);
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
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/package/get-package-data/${params?.packageId}`
      );
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
      setLoading(false);
    }
  };

  const handleBookPackage = async () => {
    if (!bookingData.date) {
      alert("Please select a travel date!");
      return;
    }
    if (!currentUser?.address || !currentUser?.phone) {
      alert("Please update your profile with address and phone before booking!");
      return;
    }

    try {
      setLoading(true);
      // Simulating dummy payment processing
      setTimeout(async () => {
        const res = await fetch(`/api/booking/book-package/${params?.packageId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...bookingData,
            paymentId: "DUMMY_PAYMENT_" + Math.random().toString(36).substr(2, 9),
          }),
        });
        const data = await res.json();
        if (data?.success) {
          setLoading(false);
          alert("Payment Successful! Your trip has been booked.");
          navigate(`/profile`);
        } else {
          setLoading(false);
          alert(data?.message);
        }
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    let date = new Date();
    date.setDate(date.getDate() + 1);
    setCurrentDate(date.toISOString().substring(0, 10));
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * bookingData?.persons
          : packageData?.packagePrice * bookingData?.persons,
      });
    }
  }, [packageData, params, bookingData.persons]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Confirm Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Traveler Info */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Traveler Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                  <p className="font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{currentUser?.username}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                  <p className="font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{currentUser?.email}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                  <p className="font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{currentUser?.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Travel Date */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Select Travel Date</h2>
              <div className="relative">
                <input
                  type="date"
                  min={currentDate}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all font-bold text-gray-700"
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                />
                <p className="mt-2 text-xs text-gray-400">Available from tomorrow onwards</p>
              </div>
            </div>

            {/* Dummy Payment Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Method</h2>
              <p className="text-sm text-gray-400 mb-6 italic">Simulation: No real money will be charged</p>
              
              <div className="border-2 border-blue-500 bg-blue-50 p-4 rounded-2xl flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                    <FaCreditCard />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-sm">Demo Payment Gateway</p>
                    <p className="text-xs text-blue-600 font-medium">Instant approval enabled</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-blue-600 bg-white"></div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FaLock /> Your booking is secured with 256-bit encryption
              </div>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-slate-900 text-white">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Booking Summary</p>
                <h3 className="text-xl font-bold">{packageData.packageName}</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Destination</span>
                  <span className="font-bold text-gray-800">{packageData.packageDestination}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-bold text-gray-800">{packageData.packageDays}D / {packageData.packageNights}N</span>
                </div>
                
                <hr className="border-gray-50" />

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium text-center">Travelers</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => bookingData.persons > 1 && setBookingData({...bookingData, persons: bookingData.persons - 1})}
                      className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center font-black hover:bg-gray-50"
                    >-</button>
                    <span className="font-black text-lg w-4 text-center">{bookingData.persons}</span>
                    <button 
                      onClick={() => bookingData.persons < 10 && setBookingData({...bookingData, persons: bookingData.persons + 1})}
                      className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center font-black hover:bg-gray-50"
                    >+</button>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Rate per person</span>
                    <span className="font-medium text-gray-600">₹{packageData.packageDiscountPrice || packageData.packagePrice}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-gray-800 font-black">Total Price</span>
                    <span className="text-3xl font-black text-blue-600">₹{bookingData.totalPrice}</span>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  onClick={handleBookPackage}
                  className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl text-lg font-black shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-xl transform active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Booking"}
                </button>
                
                <p className="text-[10px] text-center text-gray-400 mt-4 px-6 leading-relaxed">
                  By clicking "Complete Booking", you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
