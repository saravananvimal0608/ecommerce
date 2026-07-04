'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined, AppstoreOutlined, InboxOutlined, ShoppingOutlined,
  ShoppingCartOutlined, TeamOutlined, TagsOutlined,
  StarOutlined, LogoutOutlined,HomeOutlined,
} from '@ant-design/icons';
import { useRouter } from "next/navigation";

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard', href: '/admin' },
  { key: '/adminAddCategory', icon: <AppstoreOutlined />, label: 'Add Category', href: '/adminAddCategory' },
  { key: '/adminViewCategory', icon: <InboxOutlined />, label: 'View Categories', href: '/adminViewCategory' },
  { key: '/adminAddProduct', icon: <ShoppingOutlined />, label: 'Add Product', href: '/adminAddProduct' },
  { key: '/adminViewProduct', icon: <ShoppingCartOutlined />, label: 'View Products', href: '/adminViewProduct' },
  { key: '/adminUsers', icon: <TeamOutlined />, label: 'Users', href: '/adminUsers' },
  { key: '/adminCoupons', icon: <TagsOutlined />, label: 'Coupons', href: '/adminCoupons' },
  { key: '/adminReviews', icon: <StarOutlined />, label: 'Reviews', href: '/adminReviews' },
    { key: '/', icon: <HomeOutlined />, label: 'Home', href: '/' },
];


export const AdminSideBar = ({ onClose }) => {
  const pathname = usePathname();
  const router = useRouter();


    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    showToast({ icon: "success", title: "successfully logout" });
    router.push("/login");
  };
  
  return (
    <aside className="w-64 min-h-screen bg-[#0f172a] border-r border-[#1e293b] flex flex-col">

      <div className="px-6 py-5 border-b border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">A</div>
          <span className="text-white font-bold text-lg tracking-wide">AdminPanel</span>
        </div>
      </div>


      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">Menu</p>
        {menuItems.map((item) => {
          const active = pathname === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-slate-400 hover:bg-[#1e293b] hover:text-white'
                }`}
            >
              <span className={`text-base transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-violet-400'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>


      <div className="px-3 py-4 border-t border-[#1e293b]">
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogoutOutlined className="text-base" />
          Logout
        </button>
      </div>
    </aside>
  );
};
