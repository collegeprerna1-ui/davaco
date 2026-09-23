import { ShieldCheck, Zap, DollarSign, Headphones } from "lucide-react";

const features = [
  {
    title: "Genuine Products",
    desc: "100% authentic medicines from certified manufacturers",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Fast Delivery",
    desc: "Get medicines delivered to your doorstep quickly",
    icon: Zap,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Best Prices",
    desc: "Competitive pricing with great discounts",
    icon: DollarSign,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "24/7 Support",
    desc: "Expert assistance whenever you need it",
    icon: Headphones,
    color: "bg-orange-100 text-orange-600",
  },
];

const WhyChooseUs = () => {
  return (
    <div className="py-16 bg-white">
      <h2 className="text-center text-xl font-semibold mb-12">
        Why Choose DaWaCo?
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color}`}
              >
                <Icon size={26} />
              </div>

              <h3 className="font-semibold mt-4">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyChooseUs;
