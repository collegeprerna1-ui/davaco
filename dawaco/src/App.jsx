import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Reminder from "./components/Reminder";
import HeroSlider from "./components/HeroSlider";
import CategorySection from "./components/CategorySection";
import MedicinesSection from "./components/MedicinesSection";
import FeaturedMedicines from "./components/FeaturedMedicines";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
import MyProfile from "./pages/MyProfile";

const Home = () => {
  return (
    <>
      <div className="p-6">
        <HeroSlider />
      </div>
      <CategorySection />
      <MedicinesSection />
      <FeaturedMedicines />
      <WhyChooseUs />
      <Footer />
    </>
  );
};

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/reminder" element={<Reminder />} />

        <Route path="/profile" element={<MyProfile />} />
      </Routes>
      {/* Global Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  );
}

export default App;
