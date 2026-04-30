import mongoose from "mongoose";

const ratingsReviewsSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);

const RatingReview = mongoose.model("RatingReview", ratingsReviewsSchema);

export default RatingReview;
