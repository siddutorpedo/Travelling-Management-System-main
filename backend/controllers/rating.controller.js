import Package from "../models/package.model.js";
import RatingReview from "../models/ratings_reviews.model.js";

export const giveRating = async (req, res) => {
  try {
    if (req.user.id !== req.body.userRef) {
      return res.status(401).send({
        success: false,
        message: "You can only give rating on your own account!",
      });
    }

    const newRating = await RatingReview.create(req.body);
    if (!newRating) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while saving the rating.",
      });
    }

    const ratings = await RatingReview.find({ packageId: req.body.packageId });
    const totalRatings = ratings.length;
    let totalStars = 0;
    ratings.forEach((rating) => { totalStars += rating.rating; });
    const average_rating = Math.round((totalStars / totalRatings) * 10) / 10;

    const updatedPackage = await Package.findByIdAndUpdate(
      req.body.packageId,
      { $set: { packageRating: average_rating, packageTotalRatings: totalRatings } },
      { new: true }
    );

    if (updatedPackage) {
      return res.status(201).send({
        success: true,
        message: "Thanks for your feedback!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Rating saved but failed to update package stats.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error during giving rating",
      error: error.message,
    });
  }
};

export const ratingGiven = async (req, res) => {
  try {
    const rating_given = await RatingReview.findOne({
      userRef: req?.params?.userId,
      packageId: req?.params?.packageId,
    });
    if (rating_given) {
      return res.status(200).send({
        given: true,
      });
    } else {
      return res.status(200).send({
        given: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error during checking rating status",
      error: error.message,
    });
  }
};

export const averageRating = async (req, res) => {
  try {
    const ratings = await RatingReview.find({ packageId: req?.params?.id });
    let totalStars = 0;
    await ratings.map((rating) => {
      totalStars += rating.rating;
    });
    let average = Math.round((totalStars / ratings.length) * 10) / 10;
    if (ratings.length) {
      res.status(200).send({
        rating: average,
        totalRatings: ratings.length,
      });
    } else {
      res.status(200).send({
        rating: 0,
        totalRatings: 0,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error during calculating average rating",
      error: error.message,
    });
  }
};

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await RatingReview.find({
      packageId: req?.params?.id,
    })
      .populate("userRef", "username avatar")
      .limit(req?.params?.limit)
      .sort({ createdAt: -1 });
    if (ratings) {
      return res.status(200).send(ratings);
    } else {
      return res.status(200).send([]);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error during fetching all ratings",
      error: error.message,
    });
  }
};
