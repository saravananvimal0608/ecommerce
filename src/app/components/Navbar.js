"use client";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { apiRequest } from "../utils/commonApi";
import Image from "next/image";
import { useSearch } from "../context/SearchContext";
import { useRouter } from "next/navigation";
import { fetchCart } from "../redux/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FiUser, FiLogOut, FiLogIn, FiMapPin, FiPackage } from "react-icons/fi";
import { showToast } from "../utils/swal";
import { usePathname } from "next/navigation";
import { getUserFromToken } from "../utils/getRoleFromToken";
import { RiAdminLine } from "react-icons/ri";

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);
  // search and setsearch comming from usecontext from context folder
  const { search, setSearch } = useSearch();
  const router = useRouter();
  const searchRef = React.useRef(null);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const emailFirstLetter = email?.charAt(0).toUpperCase() || "";
  const toggleRef = React.useRef(null);
  const [role, setRole] = useState("");


  const showSearch =
    pathname === "/" ||
    pathname === "/product" ||
    pathname.startsWith("/product/");

  const showSearchForNoToken = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/verify-otp" || pathname === '/reset-password' || pathname.startsWith("/admin");

  const handleSearch = (value) => {
    setSearch(value);
    setShowDropdown(false);
    setIsFocused(false);
    router.push("/product");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    showToast({ icon: "success", title: "successfully logout" });
    router.push("/login");
  };

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
      // Search dropdown close
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }

      // Profile dropdown close
      if (toggleRef.current && !toggleRef.current.contains(e.target)) {
        setToggle(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("pointerdown", handleClickOutside, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handleClickOutside, { capture: true });
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const fetchRole = async () => {
      const user = await getUserFromToken(token);

      setRole(user.role);
    };

    if (token) {
      fetchRole();
    }
  }, [token]);
  useEffect(() => {
    const syncAuth = () => {
      setEmail(localStorage.getItem("email") || "");
      setToken(localStorage.getItem("token") || "");
    };
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [pathname]);

  return (
    !showSearchForNoToken && (
      <div className="hidden md:block">
      <div
        className={`w-full z-50 px-6 backdrop-blur-md transition-all duration-300 shadow-lg ${scrolled ? "fixed top-0 left-0" : "relative"
          }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between rounded-2xl  px-8 py-2">
            <Link href={"/"}>
            <div className="text-2xl font-bold text-indigo-950/60"> E-Commerce </div>
</Link>
            {showSearch && (
              <div className="relative w-full max-w-md " ref={searchRef}>
                <>
                  <input
                    type="text"
                    value={search}
                    className="w-full pl-6 pr-12 py-3 rounded-full border border-white/20 bg-indigo-950/60 backdrop-blur-sm text-white outline-none"
                    onFocus={() => {
                      setIsFocused(true);
                      if (search) setShowDropdown(true);
                    }}
                    onClick={() => {
                      if (search) setShowDropdown(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && search) handleSearch(search);
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearch(value);
                      setShowDropdown(!!value);
                      if (!value) setIsFocused(false);
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
                  <FaSearch
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                    onClick={() => {
                      if (search) handleSearch(search);
                    }}
                  />
                </>
                {showDropdown && search && (
                  <div className="absolute z-[9999] top-14 left-0 w-full bg-white rounded-xl shadow-lg max-h-72 overflow-y-auto">
                    {data?.map((item) => (
                      <div
                        key={item._id}
                        onMouseDown={() => handleSearch(item.name)}
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
            )}
            <div className="flex items-center gap-6">
              <Link href={"../cart"}>
                {" "}
                <div className="relative">
                  <FaShoppingCart
                    size={22}
                    color="#312e81"
                    className="cursor-pointer text-white/80 hover:text-white transition"
                  />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>
                <Link href={"/"}>
              <FaHome
                size={20}
                color="#312e81"
                className="cursor-pointer text-white/80 hover:text-white transition"
              />
              </Link>
              <div className="relative" ref={toggleRef}>
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-indigo-950/60 text-white backdrop-blur-sm hover:bg-indigo-950/60 cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={() => setToggle((prev) => !prev)}
                >
                  {emailFirstLetter ? emailFirstLetter : <FiUser size={20} />}
                </div>

                {toggle && (
                  <div className="absolute right-0 top-14 z-[9999] min-w-[220px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                    {token && (
                      <>
                        {role === 'admin' &&
                          <Link href="/admin" onClick={() => setToggle(false)}>
                            <button className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-100 transition">
                              <RiAdminLine size={18} />
                              <span>Admin Panel</span>
                            </button>
                          </Link>
                        }
                        <Link href="/user" onClick={() => setToggle(false)}>
                          <button className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-100 transition">
                            <FiUser size={18} />
                            <span>My Profile</span>
                          </button>
                        </Link>

                        <Link href="/orders" onClick={() => setToggle(false)}>
                          <button className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-100 transition" >
                            <FiPackage size={18} />
                            <span>My Orders</span>
                          </button>
                        </Link>

                        <Link href="/address" onClick={() => setToggle(false)}>
                          <button className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-100 transition">
                            <FiMapPin size={18} />
                            <span>My Address</span>
                          </button>
                        </Link>

                      </>
                    )}

                    {token ? (
                      <button
                        className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-red-100 transition "
                        onClick={handleLogout}
                      >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <Link href="/login">
                        <button className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-100 transition">
                          <FiLogIn size={18} />
                          <span>Login</span>
                        </button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  );
};

export default Navbar;
