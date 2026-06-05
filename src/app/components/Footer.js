import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#0D0F36] text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Simply</h1>
          <p className="text-gray-300 leading-7">
            Premium furniture and home decor products designed to bring
            comfort and elegance to your living space.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="flex flex-col gap-2 text-gray-300">
            <p className="hover:text-white cursor-pointer transition">
              Home
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Products
            </p>
            <p className="hover:text-white cursor-pointer transition">
              About Us
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Contact
            </p>
          </div>
        </div>

        {/* Customer Support */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Support</h2>
          <div className="flex flex-col gap-2 text-gray-300">
            <p className="hover:text-white cursor-pointer transition">
              FAQ
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Shipping Policy
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Return Policy
            </p>
            <p className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition">
             <FaFacebookF/>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition">
            <FaWhatsapp/>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition">
             <FaInstagram/>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition">
            <FaXTwitter/>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-10 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Simply. All Rights Reserved.
      </div>
    </footer>   
  );
};

export default Footer;