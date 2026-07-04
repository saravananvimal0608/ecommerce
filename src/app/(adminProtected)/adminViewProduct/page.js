'use client';

import { useEffect, useState, useCallback } from 'react';
import { Modal, Table, Tag } from 'antd';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { apiRequest } from '../../utils/commonApi';
import { showToast } from '../../utils/swal';
import EmptyState from '../../components/EmptyState';

const inputCls = "w-full bg-[#060f1e] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors";
const MODAL_STYLES = {
  content: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16 },
  header: { background: '#0f172a', borderBottom: '1px solid #1e293b' },
  body: { background: '#0f172a' },
  footer: { background: '#0f172a', borderTop: '1px solid #1e293b' },
  mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.6)' },
};

const CLOSE_ICON = <span className="text-slate-400 hover:text-white transition-colors">✕</span>;

export default function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [viewModal, setViewModal] = useState({ open: false, record: null });
  const [editModal, setEditModal] = useState({ open: false, record: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit, ...(search && { search }) });
      const res = await apiRequest(`/api/product/all?${params}`, 'GET');
      setProducts(res.data || []);
      setTotal(res.totalProducts || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const openEdit = (record) => {
    setEditForm({
      name: record.name,
      price: record.price,
      discount: record.discount || '',
      stock: record.stock || '',
      unit: record.unit,
      description: record.description,
    });
    setEditModal({ open: true, record });
  };

  const handleUpdate = async () => {
    try {
      setEditLoading(true);
      await apiRequest(`/api/product/update/${editModal.record._id}`, 'PUT', editForm);
      showToast({ icon: 'success', title: 'Product updated' });
      setEditModal({ open: false, record: null });
      fetchProducts();
    } catch {
      showToast({ icon: 'error', title: 'Update failed' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await apiRequest(`/api/product/delete/${deleteModal.record._id}`, 'DELETE');
      showToast({ icon: 'success', title: 'Product deleted' });
      setDeleteModal({ open: false, record: null });
      fetchProducts();
    } catch {
      showToast({ icon: 'error', title: 'Delete failed' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const ef = (k) => (e) => setEditForm((p) => ({ ...p, [k]: e.target.value }));

  const columns = [
    {
      title: '#', key: 'index', width: 55,
      render: (_, __, i) => <span className="text-slate-400 text-sm">{(page - 1) * limit + i + 1}</span>,
    },
    {
      title: 'Product', key: 'product',
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <img
            src={r.images?.[0]}
            alt={r.name}
            className="w-10 h-10 rounded-lg object-cover border border-[#1e293b] shrink-0"
          />
          <div>
            <p className="text-white text-sm font-medium line-clamp-1">{r.name}</p>
            <p className="text-slate-500 text-xs">{r.unit}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Category', dataIndex: 'category', key: 'category', width: 130,
      render: (cats) => (
        <span className="text-slate-300 text-sm">
          {Array.isArray(cats) ? cats.map((c) => c?.name || c).join(', ') : cats?.name || '—'}
        </span>
      ),
    },
    {
      title: 'Price', key: 'price', width: 110,
      render: (_, r) => (
        <div>
          <p className="text-white text-sm font-semibold">₹{r.price}</p>
          {r.discount > 0 && <p className="text-emerald-400 text-xs">{r.discount}% off</p>}
        </div>
      ),
    },
    {
      title: 'Stock', dataIndex: 'stock', key: 'stock', width: 80,
      render: (s) => (
        <Tag color={s > 10 ? 'green' : s > 0 ? 'orange' : 'red'} className="!text-xs !rounded-md">
          {s ?? '—'}
        </Tag>
      ),
    },
    {
      title: 'Type', dataIndex: 'product_type', key: 'product_type', width: 120,
      render: (t) => <span className="text-slate-400 text-xs capitalize">{t?.replace('-', ' ') || '—'}</span>,
    },
    {
      title: 'Actions', key: 'actions', width: 130,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setViewModal({ open: true, record })} className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors" title="View">
            <FiEye size={14} />
          </button>
          <button onClick={() => openEdit(record)} className="p-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors" title="Edit">
            <FiEdit2 size={14} />
          </button>
          <button onClick={() => setDeleteModal({ open: true, record })} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#060f1e] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{total} products found</p>
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full bg-[#0f172a] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden">
        <Table
          dataSource={products}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={false}
          className="admin-dark-table"
          scroll={{ x: 700 }}
          locale={{ emptyText: <EmptyState message="No products found" description="Add a new product to get started." /> }}
        />

        {/* Custom Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e293b]">
            <span className="text-slate-500 text-sm">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-[#1e293b] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={i} className="text-slate-500 px-1">...</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === n ? 'bg-violet-600 text-white' : 'bg-[#1e293b] text-slate-400 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-[#1e293b] text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── View Modal ── */}
      <Modal
        open={viewModal.open}
        onCancel={() => setViewModal({ open: false, record: null })}
        footer={null}
        centered
        width={560}
        title={<span className="text-white font-semibold">Product Details</span>}
        styles={MODAL_STYLES}
        closeIcon={CLOSE_ICON}
      >
        {viewModal.record && (
          <div className="py-3 space-y-4">
            {/* Images */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {viewModal.record.images?.map((img, i) => (
                <img key={i} src={img} className="w-24 h-24 rounded-xl object-cover border border-[#1e293b] shrink-0" />
              ))}
            </div>
            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Name', value: viewModal.record.name },
                { label: 'Category', value: Array.isArray(viewModal.record.category) ? viewModal.record.category.map((c) => c?.name || c).join(', ') : viewModal.record.category?.name },
                { label: 'Price', value: `₹${viewModal.record.price}` },
                { label: 'Discount', value: viewModal.record.discount ? `${viewModal.record.discount}%` : 'None' },
                { label: 'Stock', value: viewModal.record.stock ?? '—' },
                { label: 'Unit', value: viewModal.record.unit },
                { label: 'Type', value: viewModal.record.product_type?.replace('-', ' ') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#060f1e] rounded-xl p-3">
                  <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                  <p className="text-white text-sm font-medium capitalize">{value || '—'}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#060f1e] rounded-xl p-3">
              <p className="text-slate-500 text-xs mb-1">Description</p>
              <p className="text-slate-300 text-sm leading-relaxed">{viewModal.record.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        open={editModal.open}
        onCancel={() => setEditModal({ open: false, record: null })}
        onOk={handleUpdate}
        okText={editLoading ? 'Saving...' : 'Save Changes'}
        okButtonProps={{ loading: editLoading, style: { background: '#7c3aed', borderColor: '#7c3aed' } }}
        cancelButtonProps={{ style: { borderColor: '#1e293b', color: '#94a3b8' } }}
        centered
        width={520}
        title={<span className="text-white font-semibold">Edit Product</span>}
        styles={MODAL_STYLES}
        closeIcon={CLOSE_ICON}
      >
        <div className="grid grid-cols-2 gap-3 py-3">
          {[
            { k: 'name', label: 'Name', span: true },
            { k: 'price', label: 'Price (₹)', type: 'number' },
            { k: 'discount', label: 'Discount (%)', type: 'number' },
            { k: 'stock', label: 'Stock', type: 'number' },
            { k: 'unit', label: 'Unit' },
          ].map(({ k, label, type, span }) => (
            <div key={k} className={span ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
              <input
                type={type || 'text'}
                value={editForm[k] || ''}
                onChange={ef(k)}
                className={inputCls}
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
            <textarea rows={3} value={editForm.description || ''} onChange={ef('description')} className={inputCls + ' resize-none'} />
          </div>
        </div>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, record: null })}
        onOk={handleDelete}
        okText={deleteLoading ? 'Deleting...' : 'Yes, Delete'}
        okButtonProps={{ loading: deleteLoading, danger: true }}
        cancelButtonProps={{ style: { borderColor: '#1e293b', color: '#94a3b8' } }}
        centered
        title={<span className="text-white font-semibold">Delete Product</span>}
        styles={MODAL_STYLES}
        closeIcon={CLOSE_ICON}
      >
        <div className="py-3 text-center">
          {deleteModal.record && (
            <>
              <img src={deleteModal.record.images?.[0]} className="w-20 h-20 rounded-xl object-cover mx-auto mb-3 border border-[#1e293b]" />
              <p className="text-slate-300 text-sm">
                Are you sure you want to delete <span className="text-white font-semibold">"{deleteModal.record.name}"</span>? This cannot be undone.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
