'use client';

import { useEffect, useState, useCallback } from 'react';
import { Modal, Table, Tag } from 'antd';
import { FiSearch, FiEye, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { apiRequest } from '../../utils/commonApi';
import EmptyState from '../../components/EmptyState';

const MODAL_STYLES = {
  content: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16 },
  header: { background: '#0f172a', borderBottom: '1px solid #1e293b' },
  mask: { backdropFilter: 'blur(4px)' },
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewModal, setViewModal] = useState({ open: false, record: null });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/user/allUsers', 'GET');
      setUsers(res.data || []);
      setFiltered(res.data || []);
    } catch {
      setUsers([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.mobile?.toString().includes(q)
      )
    );
  }, [search, users]);

  const columns = [
    {
      title: '#', key: 'index', width: 55,
      render: (_, __, i) => <span className="text-slate-400 text-sm">{i + 1}</span>,
    },
    {
      title: 'User', key: 'user',
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {r.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{r.name || '—'}</p>
            <p className="text-slate-500 text-xs">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Mobile', dataIndex: 'mobile', key: 'mobile', width: 130,
      render: (m) => <span className="text-slate-300 text-sm">{m || '—'}</span>,
    },
    {
      title: 'Verified', dataIndex: 'verify_email', key: 'verify_email', width: 100,
      render: (v) => (
        <Tag color={v ? 'green' : 'orange'} className="!text-xs !rounded-md">
          {v ? 'Verified' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Joined', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (d) => <span className="text-slate-400 text-sm">{d ? new Date(d).toLocaleDateString() : '—'}</span>,
    },
    {
      title: 'Actions', key: 'actions', width: 80,
      render: (_, record) => (
        <button
          onClick={() => setViewModal({ open: true, record })}
          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
          title="View"
        >
          <FiEye size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#060f1e] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} users found</p>
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full bg-[#0f172a] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', value: users.length, color: 'text-violet-400' },
          { label: 'Verified', value: users.filter((u) => u.verify_email).length, color: 'text-emerald-400' },
          { label: 'Pending', value: users.filter((u) => !u.verify_email).length, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#0f172a] border border-[#1e293b] rounded-2xl px-5 py-4">
            <p className="text-slate-500 text-xs mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden">
        <Table
          dataSource={filtered}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="admin-dark-table"
          scroll={{ x: 600 }}
          locale={{ emptyText: <EmptyState message="No users found" description="No registered users yet." /> }}
        />
      </div>

      {/* View Modal */}
      <Modal
        open={viewModal.open}
        onCancel={() => setViewModal({ open: false, record: null })}
        footer={null}
        centered
        title={<span className="text-white font-semibold">User Details</span>}
        styles={MODAL_STYLES}
      >
        {viewModal.record && (
          <div className="py-3 space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {viewModal.record.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{viewModal.record.name || '—'}</h3>
                <Tag color={viewModal.record.verify_email ? 'green' : 'orange'} className="!text-xs !rounded-md mt-1">
                  {viewModal.record.verify_email ? 'Email Verified' : 'Pending Verification'}
                </Tag>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: <FiMail size={14} />, label: 'Email', value: viewModal.record.email },
                { icon: <FiPhone size={14} />, label: 'Mobile', value: viewModal.record.mobile || '—' },
                { icon: <FiUser size={14} />, label: 'Role', value: viewModal.record.role || 'user' },
                { icon: <FiCalendar size={14} />, label: 'Joined', value: viewModal.record.createdAt ? new Date(viewModal.record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 bg-[#060f1e] rounded-xl px-4 py-3">
                  <span className="text-violet-400">{icon}</span>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium capitalize">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
