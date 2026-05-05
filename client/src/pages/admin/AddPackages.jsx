import React, { useState } from "react";
import { HiOutlinePlus, HiOutlineCloudUpload, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineCurrencyDollar, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineInformationCircle } from "react-icons/hi";

const AddPackages = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "Flight",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
  };

  const handleImageSubmit = async () => {
    if (images.length > 0 && images.length + formData.packageImages.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      
      const data = new FormData();
      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      try {
        const res = await fetch("/api/upload/images", {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        
        if (result.success) {
          setFormData({
            ...formData,
            packageImages: formData.packageImages.concat(result.urls),
          });
          setImageUploadError(false);
          setUploading(false);
          setImages([]);
        } else {
          setImageUploadError(result.message || "Upload failed");
          setUploading(false);
        }
      } catch (err) {
        setImageUploadError(`Upload failed: ${err.message} (Check size <= 10MB)`);
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload up to 5 images total");
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) {
      alert("You must upload at least 1 image");
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/package/create-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data?.message);
        setLoading(false);
        return;
      }
      alert(data?.message);
      setFormData({
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "Flight",
        packageMeals: "",
        packageActivities: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageImages: [],
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="page-header mb-8">
        <div>
          <h2 className="page-title">Create New Package</h2>
          <p className="page-subtitle">Design a premium travel itinerary for corporate and leisure clients.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <HiOutlineInformationCircle className="text-primary" />
              General Information
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Package Name</label>
                <input
                  type="text"
                  id="packageName"
                  placeholder="e.g. Maldives Luxury Retreat"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                  value={formData.packageName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea
                  id="packageDescription"
                  rows="4"
                  placeholder="Describe the travel experience..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all resize-none"
                  value={formData.packageDescription}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Destination</label>
                  <div className="relative">
                    <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="packageDestination"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                      value={formData.packageDestination}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Transportation</label>
                  <select
                    id="packageTransportation"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all appearance-none"
                    value={formData.packageTransportation}
                    onChange={handleChange}
                  >
                    <option>Flight</option>
                    <option>Train</option>
                    <option>Boat</option>
                    <option>Luxury Car</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <HiOutlineCalendar className="text-primary" />
              Duration & Itinerary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Days</label>
                      <input
                        type="number"
                        id="packageDays"
                        min="1"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={formData.packageDays}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Nights</label>
                      <input
                        type="number"
                        id="packageNights"
                        min="1"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                        value={formData.packageNights}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Accommodation</label>
                    <input
                      type="text"
                      id="packageAccommodation"
                      placeholder="e.g. 5-Star Overwater Villa"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                      value={formData.packageAccommodation}
                      onChange={handleChange}
                    />
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Meals Provided</label>
                    <input
                      type="text"
                      id="packageMeals"
                      placeholder="e.g. Breakfast & Dinner"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all"
                      value={formData.packageMeals}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Key Activities</label>
                    <textarea
                      id="packageActivities"
                      rows="2"
                      placeholder="Scuba diving, Spa, Island hopping..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-all resize-none"
                      value={formData.packageActivities}
                      onChange={handleChange}
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Pricing */}
        <div className="space-y-6">
          <div className="admin-card p-8">
             <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <HiOutlineCloudUpload className="text-primary" />
              Package Media
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary transition-all cursor-pointer bg-gray-50 group">
                <input
                  type="file"
                  id="packageImages"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="packageImages" className="cursor-pointer">
                  <HiOutlineCloudUpload className="mx-auto text-4xl text-gray-300 group-hover:text-primary transition-colors mb-2" />
                  <p className="text-xs font-bold text-gray-500">Click to upload images</p>
                  <p className="text-[10px] text-gray-400 mt-1">Max 5 images, up to 10MB each</p>
                </label>
              </div>

              {images.length > 0 && (
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  disabled={uploading}
                  className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:bg-gray-400 transition-all shadow-lg"
                >
                  {uploading ? "Uploading..." : "Confirm Image Upload"}
                </button>
              )}

              {imageUploadError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] text-rose-600 font-bold animate-fadeIn">
                  {imageUploadError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 mt-4">
                {/* Local Previews (Not yet uploaded) */}
                {images.length > 0 && Array.from(images).map((file, i) => (
                  <div key={`local-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-amber-200 opacity-60">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-50/50">
                       <span className="text-[8px] font-bold text-amber-600 uppercase bg-white px-1 rounded shadow-sm">Pending Upload</span>
                    </div>
                  </div>
                ))}

                {/* Uploaded Images */}
                {formData.packageImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover" alt="upload" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(i)}
                      className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-card p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <HiOutlineCurrencyDollar className="text-primary" />
              Pricing Strategy
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Base Price ($)</label>
                <div className="relative">
                  <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="packagePrice"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all"
                    value={formData.packagePrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                 <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="packageOffer"
                      className="w-4 h-4 accent-primary"
                      checked={formData.packageOffer}
                      onChange={handleChange}
                    />
                    <label htmlFor="packageOffer" className="text-sm font-bold text-gray-700">Special Offer</label>
                 </div>
                 {formData.packageOffer && <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full font-bold">Active</span>}
              </div>

              {formData.packageOffer && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-xs font-bold text-gray-500 uppercase">Discounted Price ($)</label>
                  <input
                    type="number"
                    id="packageDiscountPrice"
                    className="w-full px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    value={formData.packageDiscountPrice}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 transition-all disabled:bg-gray-200 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            {loading ? "Creating..." : (
              <>
                <HiOutlineCheckCircle className="text-lg" />
                Publish Travel Package
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackages;

