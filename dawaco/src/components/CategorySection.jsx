import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  FlaskConical,
  Stethoscope,
  HeartPulse,
  Baby,
  Dumbbell,
  Leaf,
} from "lucide-react";

const categories = [
  {
    title: "Medicines",
    desc: "Prescription & OTC",
    icon: <Pill className="text-pink-500" size={36} />,
    bg: "bg-blue-50",
    query: "Paracetamol",
  },
  {
    title: "Vitamins",
    desc: "Health Supplements",
    icon: <FlaskConical className="text-green-500" size={36} />,
    bg: "bg-green-50",
    query: "Vitamin",
  },
  {
    title: "Diabetes Care",
    desc: "Sugar Control",
    icon: <HeartPulse className="text-purple-500" size={36} />,
    bg: "bg-purple-50",
    query: "Diabetes",
  },
  {
    title: "Devices",
    desc: "Medical Equipment",
    icon: <Stethoscope className="text-blue-600" size={36} />,
    bg: "bg-orange-50",
    query: "Device",
  },
  {
    title: "Pain Relief",
    desc: "Joint & Muscles",
    icon: <HeartPulse className="text-pink-400" size={36} />,
    bg: "bg-pink-50",
    query: "Pain Relief",
  },
  {
    title: "Baby Care",
    desc: "Mother & Baby",
    icon: <Baby className="text-yellow-500" size={36} />,
    bg: "bg-yellow-50",
    query: "Baby",
  },
  {
    title: "Supplements",
    desc: "Protein & Nutrition",
    icon: <Dumbbell className="text-orange-500" size={36} />,
    bg: "bg-orange-50",
    query: "Supplements",
  },
  {
    title: "OTC",
    desc: "Over The Counter",
    icon: <Leaf className="text-green-600" size={36} />,
    bg: "bg-emerald-50",
    query: "OTC",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (query) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
    // Smooth scroll down to medicines section
    setTimeout(() => {
      const section = document.getElementById("medicines-catalog");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="px-6 md:px-10 py-12 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse our wide range of healthcare products
          </p>
        </div>
        <button
          onClick={() => handleCategoryClick("")}
          className="text-blue-600 font-semibold hover:underline text-sm"
        >
          View All →
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(cat.query)}
            className={`${cat.bg} rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-0.5 transition duration-300 cursor-pointer`}
          >
            <div className="mb-4">{cat.icon}</div>
            <h3 className="font-bold text-gray-800 text-sm">{cat.title}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
              {cat.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
