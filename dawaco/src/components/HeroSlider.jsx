import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const slides = [
  {
    id: 1,
    title: "Up to 50% OFF",
    subtitle: "On Diabetes Care",
    desc: "Get the best prices on diabetes management products",
    image: slide1,
  },
  {
    id: 2,
    title: "Flat 30% OFF",
    subtitle: "On Medicines",
    desc: "Save more on essential medicines",
    image: slide2,
  },
  {
    id: 3,
    title: "Up to 40% OFF",
    subtitle: "On Healthcare Devices",
    desc: "BP monitors, glucometers & more",
    image: slide3,
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[420px] overflow-hidden rounded-xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90" />

          {/* Content */}
          <div className="relative z-10 flex h-full items-center justify-between px-16">
            {/* Text */}
            <div className="text-white max-w-lg">
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                Limited Time
              </span>

              <h1 className="text-4xl font-bold mt-4">
                {slide.title}
              </h1>

              <h2 className="text-2xl mt-2">
                {slide.subtitle}
              </h2>

              <p className="mt-3 text-white/90">
                {slide.desc}
              </p>

              <div className="mt-6 flex gap-4">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold">
                  Shop Now
                </button>
                <button className="border border-white px-6 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>

            {/* Image */}
            <img
              src={slide.image}
              alt="slide"
              className="h-[300px] rounded-xl shadow-lg"
            />
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default HeroSlider;
