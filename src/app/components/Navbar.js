"use client";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { apiRequest } from "../utils/commonApi";
import Image from "next/image";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const searchRef = React.useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await apiRequest(
          `/api/product/all?search=${search}`,
          "get",
        );

        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowDropdown(false);
    };

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 px-6 bg-indigo-950/60 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-2xl  px-8 py-2">
          <div className="text-2xl font-bold text-white">Simply</div>

          <div className="relative w-full max-w-md" ref={searchRef}>
            <>
              <input
                type="text"
                value={search}
                className="w-full pl-6 pr-12 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white outline-none"
                onFocus={() => {
                  setIsFocused(true);
                  if (search) setShowDropdown(true);
                }}
                onClick={() => {
                  if (search) setShowDropdown(true);
                }}
                onChange={(e) => {
                  const value = e.target.value;

                  setSearch(value);
                  setShowDropdown(!!value);

                  if (!value) {
                    setIsFocused(false);
                  }
                }}
              />
              {!isFocused && !search && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center text-gray-300 pointer-events-none">
                  <span>Search&nbsp;</span>
                  <Typewriter
                    words={["denim", "Shirts", "Shoes", "T-Shirts"]}
                    loop={0}
                    cursor={false}
                    typeSpeed={100}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </div>
              )}
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-white" />
            </>
            {showDropdown && search && (
              <div className="absolute z-[9999] top-14 left-0 w-full bg-white rounded-xl shadow-lg max-h-72 overflow-y-auto">
                {data?.map((item) => (
                  <div
                    key={item._id}
                    onMouseDown={() => {
                      setSearch(item.name);
                      setShowDropdown(false);
                      setIsFocused(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.images?.[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover border"
                      />
                    )}
                    <span className="text-sm text-gray-800 truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <FaShoppingCart
              size={22}
              className="cursor-pointer text-white/80 hover:text-white transition"
            />

            <FaRegMessage
              size={20}
              className="cursor-pointer text-white/80 hover:text-white transition"
            />

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm">
              S
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
