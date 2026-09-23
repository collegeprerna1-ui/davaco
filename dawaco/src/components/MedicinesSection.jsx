import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const tabs = [
  "All Medicines",
  "Prescription",
  "OTC",
  "Antibiotics",
  "Pain Relief",
  "Vitamins",
  "Supplements",
];

const fallbackProducts = [
  {
    id: 1,
    name: "Paracetamol 650mg",
    type: "Tablet",
    price: 28.5,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
  },
  {
    id: 2,
    name: "Crocin Advance",
    type: "Tablet",
    price: 35.0,
    image: "https://images.unsplash.com/photo-1581159186721-b68b78da4ec9?fm=jpg&q=60&w=3000",
  },
  {
    id: 3,
    name: "Dolo 650",
    type: "Tablet",
    price: 30.0,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
  },
  {
    id: 4,
    name: "Vitamin C Chewable",
    type: "Tablet",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
  },
];

const MedicinesSection = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [activeTab, setActiveTab] = useState("All Medicines");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Trigger search parameter sync to activeTab if search is active
  useEffect(() => {
    if (searchQuery) {
      setActiveTab("All Medicines");
    }
  }, [searchQuery]);

  // Fetch medicines when activeTab or searchQuery changes
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        let url = `/api/medicines?category=${encodeURIComponent(activeTab)}`;
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [activeTab, searchQuery]);

  return (
    <div id="medicines-catalog" className="px-6 md:px-10 py-12 bg-white">
      {/* Search Header Info */}
      {searchQuery && (
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-blue-800 font-medium">
            Search results for: <span className="font-bold">"{searchQuery}"</span> ({products.length} items found)
          </p>
          <button
            onClick={() => {
              // Clear search by changing search parameter
              window.history.pushState({}, "", "/");
              // Dispatch event to force update
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="text-xs text-blue-600 hover:underline font-bold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300
              ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 border rounded-2xl bg-gray-50 text-gray-500">
          <span className="text-4xl">💊</span>
          <p className="text-base font-bold mt-2">No medicines found</p>
          <p className="text-xs mt-1">Try resetting the filter or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group bg-white"
            >
              {/* Product Image */}
              <div className="overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Title & Type */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-xs line-clamp-2 min-h-[32px] group-hover:text-blue-600 transition">
                    {product.name}
                  </h3>
                  <span className="inline-block bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase">
                    {product.type || "OTC"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                  <span className="text-green-600 font-bold text-sm">
                    ₹{product.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition active:scale-95 shadow-sm"
                  >
                    Add
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

export default MedicinesSection;
