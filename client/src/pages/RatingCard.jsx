import { Rating } from "@mui/material";
import React, { useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import defaultProfileImg from "../assets/images/profile.png";

const RatingItem = ({ rating }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative w-full rounded-lg border p-3 gap-2 flex flex-col bg-white hover:shadow-md transition-shadow">
      <div className="flex gap-2 items-center">
        <img
          src={rating?.userRef?.avatar || defaultProfileImg}
          alt={rating?.userRef?.username ? rating.userRef.username[0] : "U"}
          className="border w-8 h-8 border-gray-200 rounded-full object-cover"
        />
        <p className="font-bold text-sm text-gray-800">
          {rating?.userRef?.username || "Anonymous Traveler"}
        </p>
      </div>
      <Rating
        value={rating.rating || 0}
        readOnly
        size="small"
        precision={0.1}
      />
      <div className="text-sm text-gray-600">
        <p className="break-words">
          {rating.review !== "" ? (
            <>
              {expanded || rating.review.length <= 90 ? (
                rating.review
              ) : (
                `${rating.review.substring(0, 90)}...`
              )}
              {rating.review.length > 90 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-1 ml-1 font-bold text-primary hover:underline focus:outline-none"
                >
                  {expanded ? (
                    <>Less <FaArrowUp /></>
                  ) : (
                    <>More <FaArrowDown /></>
                  )}
                </button>
              )}
            </>
          ) : (
            <span className="italic text-gray-400">
              {rating.rating < 3 ? "Not Bad" : "Good"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

const RatingCard = ({ packageRatings }) => {
  if (!Array.isArray(packageRatings) || packageRatings.length === 0) {
    return <p className="text-gray-400 italic text-sm p-4">No ratings yet.</p>;
  }

  return (
    <>
      {packageRatings.map((rating, i) => (
        <RatingItem key={i} rating={rating} />
      ))}
    </>
  );
};

export default RatingCard;
