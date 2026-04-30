
import { FaExternalLinkAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="w-full flex justify-center py-12 bg-slate-50 min-h-screen">
      <div className="w-[90%] max-w-3xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">About Us</h1>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
        </div>

        <div className="space-y-6">
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            At <span className="text-blue-600 font-bold italic">Dream Tours</span>, we believe that travel is more than just visiting a destination; it's about the memories that stay with you forever. Our mission is to provide curated, high-quality travel experiences that inspire and delight.
          </p>
          <p className="text-slate-500 leading-relaxed text-lg">
            With years of experience in the industry, our team works tirelessly to bring you the best packages, the most comfortable accommodations, and the most thrilling activities. Whether you're looking for a relaxing beach getaway or a rugged mountain adventure, we have something for everyone.
          </p>
          <p className="text-slate-500 leading-relaxed text-lg">
            We are committed to sustainable and responsible tourism, ensuring that our travels leave a positive impact on the local communities and environments we visit. Join us on a journey to discover the hidden gems and iconic landmarks of the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
          <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100 transition-transform hover:-translate-y-2 duration-300">
            <h4 className="text-3xl font-black text-blue-600 mb-1">500+</h4>
            <p className="text-slate-600 font-bold text-sm uppercase tracking-wide">Tours Completed</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100 transition-transform hover:-translate-y-2 duration-300">
            <h4 className="text-3xl font-black text-blue-600 mb-1">10k+</h4>
            <p className="text-slate-600 font-bold text-sm uppercase tracking-wide">Happy Travelers</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100 transition-transform hover:-translate-y-2 duration-300">
            <h4 className="text-3xl font-black text-blue-600 mb-1">15+</h4>
            <p className="text-slate-600 font-bold text-sm uppercase tracking-wide">Destinations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
