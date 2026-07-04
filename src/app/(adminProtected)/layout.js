'use client';
import { useState } from 'react';
import { AdminSideBar } from '../components/AdminSideBar';
import AdminProtectedLayout from './adminProtected';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminProtectedLayout>
      <div className="flex h-screen bg-[#060f1e] overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed lg:static z-30 h-full transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <AdminSideBar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0f172a] border-b border-[#1e293b]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-white font-bold text-base">AdminPanel</span>
          </div>
          {children}
        </main>
      </div>
    </AdminProtectedLayout>
  );
}
