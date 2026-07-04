'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { FiUser, FiLogOut, FiLogIn, FiMapPin, FiPackage, FiX, FiMenu } from 'react-icons/fi';
import { RiAdminLine } from 'react-icons/ri';
import { Typewriter } from 'react-simple-typewriter';
import { useDispatch, useSelector } from 'react-redux';
import { useSearch } from '../context/SearchContext';
import { apiRequest } from '../utils/commonApi';
import { fetchCart } from '../redux/slice/cartSlice';
import { showToast } from '../utils/swal';
import { getUserFromToken } from '../utils/getRoleFromToken';

export default function MobileNavbar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useSelector((s) => s.cart.items);
  const { search, setSearch } = useSearch();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const searchRef = useRef(null);
  const emailFirstLetter = email?.charAt(0).toUpperCase() || '';

  const hideNav =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/verify-otp' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/admin');

  const showSearch =
    pathname === '/' ||
    pathname === '/product' ||
    pathname.startsWith('/product/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('email') || '');
      setToken(localStorage.getItem('token') || '');
    }
  }, []);

  useEffect(() => {
    if (token) {
      getUserFromToken(token).then((u) => setRole(u?.role || ''));
    }
  }, [token]);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  useEffect(() => { setDrawerOpen(false); setShowDropdown(false); }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search) return;
      try {
        const res = await apiRequest(`/api/product/all?search=${search}`, 'get');
        setData(res.data);
      } catch { }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (value) => {
    setSearch(value);
    setShowDropdown(false);
    setIsFocused(false);
    router.push('/product');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    showToast({ icon: 'success', title: 'Successfully logged out' });
    setDrawerOpen(false);
    router.push('/login');
  };

  if (hideNav) return null;

  return (
    <>
      {/* ── Top bar: search + menu icon on one line (mobile only) ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[9999] bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-2.5">
          {/* Search bar */}
          {showSearch ? (
            <div className="relative flex-1" ref={searchRef}>
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={13} />
              <input
                type="text"
                value={search}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-indigo-50 text-gray-800 text-sm outline-none border border-indigo-100 focus:border-indigo-400 transition placeholder-gray-400"
                placeholder=""
                onFocus={() => { setIsFocused(true); if (search) setShowDropdown(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && search) handleSearch(search); }}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearch(v);
                  setShowDropdown(!!v);
                  if (!v) { setIsFocused(false); setShowDropdown(false); }
                }}
              />
              {!isFocused && !search && (
                <div className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none flex">
                  <Typewriter words={['Search denim...', 'Search Shirts...', ' Search Shoes...', 'Search T-Shirts...']} loop={0} cursor={false} typeSpeed={100} deleteSpeed={50} delaySpeed={1500} />
                </div>
              )}
              {showDropdown && search && data?.length > 0 && (
                <div className="absolute z-[9999] top-11 left-0 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto border border-gray-100">
                  {data.map((item) => (
                    <div key={item._id} onMouseDown={() => handleSearch(item.name)} className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 cursor-pointer">
                      {item.images?.[0] && <Image src={item.images[0]} alt={item.name} width={36} height={36} className="rounded-md object-cover border flex-shrink-0" />}
                      <span className="text-sm text-gray-800 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Menu icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex-shrink-0 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-900 border border-indigo-100"
          >
            <FiMenu size={20} />
          </button>
        </div>
      </div>

      {/* ── Sidebar Drawer ── */}
      <div className={`md:hidden fixed inset-0 z-[99999] transition-all duration-300 ${drawerOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Panel */}
        <div className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          {/* Sidebar Header: shop name + cart + close */}
          <div className="flex items-center justify-between px-5 py-4 bg-indigo-950">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">S</div>
                         <Link href={"/"}>
 <span className="text-white font-bold text-lg tracking-wide">E-Commerce</span>
             </Link>

            </div>
            <div className="flex items-center gap-3">
              <Link href="/cart" onClick={() => setDrawerOpen(false)}>
                <div className="relative">
                  <FaShoppingCart size={20} className="text-white/80 hover:text-white transition" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>
              <button onClick={() => setDrawerOpen(false)} className="text-white/70 hover:text-white">
                <FiX size={22} />
              </button>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 px-5 py-3 bg-indigo-900/10 border-b border-indigo-100">
            <div className="w-9 h-9 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-base flex-shrink-0">
              {emailFirstLetter || <FiUser size={16} />}
            </div>
            <div className="min-w-0">
              <p className="text-gray-800 font-semibold text-sm truncate">{email || 'Guest'}</p>
              <p className="text-indigo-400 text-xs capitalize">{role || 'User'}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {token && role === 'admin' && (
              <Link href="/admin" onClick={() => setDrawerOpen(false)}>
                <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50 transition group">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition">
                    <RiAdminLine size={18} className="text-violet-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Admin Panel</span>
                </div>
              </Link>
            )}

            {token ? (
              <>
                <Link href="/user" onClick={() => setDrawerOpen(false)}>
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50 transition group">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
                      <FiUser size={18} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">My Profile</span>
                  </div>
                </Link>
                <Link href="/orders" onClick={() => setDrawerOpen(false)}>
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50 transition group">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                      <FiPackage size={18} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">My Orders</span>
                  </div>
                </Link>
                <Link href="/address" onClick={() => setDrawerOpen(false)}>
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50 transition group">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition">
                      <FiMapPin size={18} className="text-orange-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">My Address</span>
                  </div>
                </Link>
                <Link href="/cart" onClick={() => setDrawerOpen(false)}>
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50 transition group">
                    <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition">
                      <FaShoppingCart size={16} className="text-pink-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">My Cart</span>
                      {cartItems?.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartItems.length}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setDrawerOpen(false)}>
                <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-indigo-50 transition group">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                    <FiLogIn size={18} className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Login</span>
                </div>
              </Link>
            )}
          </nav>

          {/* Logout */}
          {token && (
            <div className="border-t border-gray-100 p-4">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 transition">
                <FiLogOut size={18} className="text-red-500" />
                <span className="text-sm font-medium text-red-500">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
