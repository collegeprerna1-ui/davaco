import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const fallbackMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    desc: "Pain relief and fever reducer",
    price: 25,
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
  },
  {
    id: 2,
    name: "Vitamin D3 Tablets",
    desc: "Bone health supplement",
    price: 180,
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2",
  },
  {
    id: 3,
    name: "Amoxicillin 250mg",
    desc: "Antibiotic capsules",
    price: 120,
    discount: "5% OFF",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    desc: "Anti-inflammatory medicine",
    price: 45,
    discount: "12% OFF",
    image: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df",
  },
];

const FeaturedMedicines = () => {
  const { addToCart } = useCart();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
const response = await fetch("/api/medicines");
        if (response.ok) {
          const data = await response.json();
setMedicines(
  data.length > 0
    ? data.slice(0, 4)
    : fallbackMedicines
);
        } else {
          setMedicines(fallbackMedicines);
        }
      } catch (err) {
        console.error("Failed to fetch featured medicines:", err);
        setMedicines(fallbackMedicines);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="px-6 md:px-10 py-12 bg-gray-50 border-t border-b border-gray-100">
      {/* Heading */}
      <div className="max-w-xl mx-auto text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Featured Medicines
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Top high-quality medicines curated and recommended by health experts.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Discount */}
              <div className="relative overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 w-full object-cover group-hover:scale-105 transition duration-500"
                />
                {item.discount && item.discount !== "0% OFF" && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    {item.discount}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc || item.description || "High-quality pharmaceutical product."}
                  </p>
                </div>

                <div className="mt-4">
                  {/* Price */}
                  <p className="text-green-600 font-bold text-base">
                    ₹{item.price.toFixed(2)}
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="mt-3 w-full bg-blue-600 text-white font-medium text-xs py-2.5 rounded-xl hover:bg-blue-700 transition active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedMedicines;
