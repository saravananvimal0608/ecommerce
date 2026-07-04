'use client';

import { useEffect, useState, useCallback } from 'react';
import { Modal, Table } from 'antd';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiUploadCloud } from 'react-icons/fi';
import { apiRequest } from '../../utils/commonApi';
import { showToast } from '../../utils/swal';
import EmptyState from '../../components/EmptyState';

export default function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [viewModal, setViewModal] = useState({ open: false, record: null });
  const [editModal, setEditModal] = useState({ open: false, record: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`/api/category/getAllCategory${search ? `?search=${search}` : ''}`, 'GET');
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchCategories, 400);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const openEdit = (record) => {
    setEditName(record.name);
    setEditPreview(record.image);
    setEditImage(null);
    setEditModal({ open: true, record });
  };

  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!editName) return showToast({ icon: 'warning', title: 'Name is required' });
    const formData = new FormData();
    formData.append('name', editName);
    if (editImage) formData.append('category-image', editImage);

    try {
      setEditLoading(true);
      await apiRequest(`/api/category/update-category/${editModal.record._id}`, 'PUT', formData, { 'Content-Type': 'multipart/form-data' });
      showToast({ icon: 'success', title: 'Category updated' });
      setEditModal({ open: false, record: null });
      fetchCategories();
    } catch {
      showToast({ icon: 'error', title: 'Update failed' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await apiRequest(`/api/category/delete-category/${deleteModal.record._id}`, 'DELETE');
      showToast({ icon: 'success', title: 'Category deleted' });
      setDeleteModal({ open: false, record: null });
      fetchCategories();
    } catch {
      showToast({ icon: 'error', title: 'Delete failed' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, i) => <span className="text-slate-400 text-sm">{i + 1}</span>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (img) => (
        <img src={img} alt="cat" className="w-10 h-10 rounded-lg object-cover border border-[#1e293b]" />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span className="text-white font-medium text-sm">{name}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => <span className="text-slate-400 text-sm">{d ? new Date(d).toLocaleDateString() : '—'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewModal({ open: true, record })}
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
            title="View"
          >
            <FiEye size={15} />
          </button>
          <button
            onClick={() => openEdit(record)}
            className="p-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 transition-colors"
            title="Edit"
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, record })}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#060f1e] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-slate-400 text-sm mt-1">{categories.length} categories found</p>
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#0f172a] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden">
        <Table
          dataSource={categories}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="admin-dark-table"
          scroll={{ x: 500 }}
          locale={{ emptyText: <EmptyState message="No categories found" description="Add a new category to get started." /> }}
        />
      </div>

      {/* ── View Modal ── */}
      <Modal
        open={viewModal.open}
        onCancel={() => setViewModal({ open: false, record: null })}
        footer={null}
        centered
        title={<span className="text-white font-semibold">Category Details</span>}
        styles={{ content: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16 }, header: { background: '#0f172a', borderBottom: '1px solid #1e293b' }, body: { background: '#0f172a' }, mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.6)' } }}
        closeIcon={<span className="text-slate-400 hover:text-white transition-colors">✕</span>}
      >
        {viewModal.record && (
          <div className="flex flex-col items-center gap-4 py-4">
            <img src={viewModal.record.image} alt={viewModal.record.name} className="w-40 h-40 rounded-2xl object-cover border border-[#1e293b]" />
            <div className="text-center">
              <h3 className="text-white text-xl font-bold">{viewModal.record.name}</h3>
              <p className="text-slate-400 text-sm mt-1">
                Added on {viewModal.record.createdAt ? new Date(viewModal.record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
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
        title={<span className="text-white font-semibold">Edit Category</span>}
        styles={{ content: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16 }, header: { background: '#0f172a', borderBottom: '1px solid #1e293b' }, body: { background: '#0f172a' }, footer: { background: '#0f172a', borderTop: '1px solid #1e293b' }, mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.6)' } }}
        closeIcon={<span className="text-slate-400 hover:text-white transition-colors">✕</span>}
      >
        <div className="space-y-4 py-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category Image</label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#1e293b] rounded-xl cursor-pointer hover:border-violet-500/60 transition-colors bg-[#060f1e] overflow-hidden relative">
              {editPreview ? (
                <img src={editPreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <FiUploadCloud size={28} />
                  <span className="text-xs">Click to change image</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleEditImage} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-[#060f1e] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
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
        title={<span className="text-white font-semibold">Delete Category</span>}
        styles={{ content: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16 }, header: { background: '#0f172a', borderBottom: '1px solid #1e293b' }, body: { background: '#0f172a' }, footer: { background: '#0f172a', borderTop: '1px solid #1e293b' }, mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.6)' } }}
        closeIcon={<span className="text-slate-400 hover:text-white transition-colors">✕</span>}
      >
        <div className="py-3 text-center">
          {deleteModal.record && (
            <>
              <img src={deleteModal.record.image} alt={deleteModal.record.name} className="w-20 h-20 rounded-xl object-cover mx-auto mb-3 border border-[#1e293b]" />
              <p className="text-slate-300 text-sm">
                Are you sure you want to delete <span className="text-white font-semibold">"{deleteModal.record.name}"</span>? This action cannot be undone.
              </p>
            </>
          )}
        </div>
      </Modal>


    </div>
  );
}
