import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Link to={`/package/${packageData._id}`} className="w-full">
      <div className="w-full bg-white border border-slate-100 flex flex-col items-center rounded-2xl shadow-sm overflow-hidden hover-card transition-all duration-300">
        <div className="w-full h-[220px] overflow-hidden relative group">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={packageData.packageImages[0]}
            alt="Package Image"
          />
          {packageData.offer && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              SPECIAL OFFER
            </div>
          )}
        </div>
        <div className="w-full flex flex-col p-5 gap-1">
          <p className="font-bold text-xl text-slate-800 capitalize truncate">
            {packageData.packageName}
          </p>
          <p className="text-blue-600 text-sm font-semibold flex items-center gap-1 capitalize">
            <FaMapMarkerAlt className="text-xs" /> {packageData.packageDestination}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
              <p className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <FaClock className="text-slate-400" />
                {+packageData.packageDays > 0 &&
                  (+packageData.packageDays > 1
                    ? packageData.packageDays + " Days"
                    : packageData.packageDays + " Day")}
                {+packageData.packageDays > 0 &&
                  +packageData.packageNights > 0 &&
                  " - "}
                {+packageData.packageNights > 0 &&
                  (+packageData.packageNights > 1
                    ? packageData.packageNights + " Nights"
                    : packageData.packageNights + " Night")}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
            {packageData.packageTotalRatings > 0 ? (
              <div className="flex items-center gap-1">
                <Rating
                  value={packageData.packageRating}
                  size="small"
                  readOnly
                  precision={0.1}
                />
                <span className="text-xs text-slate-400 font-bold">({packageData.packageTotalRatings})</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium italic">No ratings yet</div>
            )}
            
            <div className="flex items-baseline gap-1">
              {packageData.offer && packageData.packageDiscountPrice ? (
                <>
                  <span className="text-xs text-slate-400 line-through">
                    ${packageData.packagePrice}
                  </span>
                  <span className="font-bold text-xl text-blue-600">
                    ${packageData.packageDiscountPrice}
                  </span>
                </>
              ) : (
                <span className="font-bold text-xl text-blue-600">
                  ${packageData.packagePrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
