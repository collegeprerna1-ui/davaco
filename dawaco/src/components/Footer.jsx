const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo / About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            DaWaCo
          </h3>
          <p className="text-sm leading-relaxed">
            Your trusted online pharmacy for genuine medicines
            and healthcare products.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              About Us
            </li>
            <li className="hover:text-white cursor-pointer">
              Contact
            </li>
            <li className="hover:text-white cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-white cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Categories
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              Medicines
            </li>
            <li className="hover:text-white cursor-pointer">
              Healthcare Devices
            </li>
            <li className="hover:text-white cursor-pointer">
              Wellness
            </li>
            <li className="hover:text-white cursor-pointer">
              Personal Care
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">
            Contact Us
          </h4>
          <p className="text-sm">Email: dawaco75@gmail.com</p>
          <p className="text-sm mt-2">
            Phone: 1800-XXX-XXXX
          </p>
          <p className="text-sm mt-2">
            Mon–Sat: 9AM - 9PM
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © 2024 DaWaCo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
