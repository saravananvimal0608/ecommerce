'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUploadCloud } from 'react-icons/fi';
import { apiRequest } from '../../utils/commonApi';
import { showToast } from '../../utils/swal';

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) return c

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category-image', image);

    try {
      setLoading(true);
      await apiRequest('/api/category/add-category', 'POST', formData, { 'Content-Type': 'multipart/form-data' });
      showToast({ icon: 'success', title: 'Category added successfully' });
      router.push('/adminViewCategory');
    } catch {
      showToast({ icon: 'error', title: 'Failed to add category' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] p-6 flex flex-col justify-center items-center">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add Category</h1>
        <p className="text-slate-400 text-sm mt-1">Create a new product category</p>
      </div>

      <div className="max-w-lg w-full bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category Image</label>
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[#1e293b] rounded-xl cursor-pointer hover:border-violet-500/60 transition-colors bg-[#060f1e] overflow-hidden relative">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <FiUploadCloud size={32} />
                  <span className="text-sm">Click to upload image</span>
                  <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Electronics"
              className="w-full bg-[#060f1e] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
