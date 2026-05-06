import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Package from "../models/package.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Bookings
    const totalBookings = await Booking.countDocuments();

    // 2. Total Revenue
    const revenueData = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 3. Total Users
    const totalUsers = await User.countDocuments();

    // 4. Active Travelers (Users with bookings)
    const activeTravelersCount = await Booking.distinct("buyer");
    const activeTravelers = activeTravelersCount.length;

    // 5. Pending Requests (Only 'Pending' or 'Booked' - not yet Completed)
    const pendingRequests = await Booking.countDocuments({
      status: { $in: ["Booked", "Pending"] },
    });

    // 6. Top Destinations (Aggregation)
    const topDestinations = await Booking.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "packageDetails",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
      {
        $group: {
          _id: "$package.packageDestination",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Format top destinations for frontend
    const formattedTopDestinations = topDestinations.map((dest) => ({
      name: dest._id,
      percentage: Math.round((dest.count / totalBookings) * 100) || 0,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        totalUsers,
        activeTravelers,
        pendingRequests,
        topDestinations: formattedTopDestinations,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};
