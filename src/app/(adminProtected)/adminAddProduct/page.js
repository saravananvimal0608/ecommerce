'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { apiRequest } from '../../utils/commonApi';
import { showToast } from '../../utils/swal';

const PRODUCT_TYPES = ['normal-product', 'offer-product', 'best-seller', 'top-product', 'trending-product'];

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full bg-[#060f1e] border border-[#1e293b] text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors";

export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', sub_category: '', unit: '', stock: '',
    price: '', discount: '', description: '', more_details: '', product_type: '',
  });

  useEffect(() => {
    apiRequest('/api/category/getAllCategory', 'GET')
      .then((r) => setCategories(r.data || []))
      .catch(() => { });
  }, []);


  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', "image/webp",
    "image/avif",];

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const invalid = files.some((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalid) return showToast({ icon: 'warning', title: 'Only JPG, JPEG, and PNG images are allowed' });
    const remaining = 5 - images.length;
    const selected = files.slice(0, remaining);
    setImages((p) => [...p, ...selected]);
    setPreviews((p) => [...p, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, category, unit, price, description, product_type, stock, discount } = form;
    if (!name || !category || !unit || !price || !description || !product_type || !images.length || !stock)
      return showToast({ icon: 'warning', title: 'All required fields must be filled' });
    if (discount && Number(discount) > 100) {
      return showToast({
        icon: 'warning',
        title: 'Discount should be less than or equal to 100%',
      });
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
    images.forEach((img) => formData.append('product-image', img));

    try {
      setLoading(true);
      await apiRequest('/api/product/add', 'POST', formData, { 'Content-Type': 'multipart/form-data' });
      showToast({ icon: 'success', title: 'Product added successfully' });
      router.push('/adminViewProduct');
    } catch (err) {
      console.log(err?.response?.data)
      showToast({ icon: 'error', title: err?.response?.data?.message || 'Failed to add product' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060f1e] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add Product</h1>
        <p className="text-slate-400 text-sm mt-1">Fill in the details to create a new product</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Images */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-300 mb-3">Product Images <span className="text-slate-500">(up to 5)</span></p>

            {/* Upload area */}
            {images.length < 5 && (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#1e293b] rounded-xl cursor-pointer hover:border-violet-500/60 transition-colors bg-[#060f1e] mb-3">
                <FiUploadCloud size={26} className="text-slate-500 mb-1" />
                <span className="text-xs text-slate-500">Click to upload</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,.avif"
                  multiple className="hidden" onChange={handleImages} />
              </label>
            )}

            {/* Previews */}
            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-[#1e293b]">
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={11} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Fields */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name *">
              <input className={inputCls} placeholder="e.g. Wireless Headphones" value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Category *">
              <select className={inputCls} value={form.category} onChange={set('category')}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Sub Category">
              <input className={inputCls} placeholder="e.g. Over-ear" value={form.sub_category} onChange={set('sub_category')} />
            </Field>
            <Field label="Unit *">
              <input className={inputCls} placeholder="e.g. piece, kg, litre" value={form.unit} onChange={set('unit')} />
            </Field>
            <Field label="Price (₹) *">
              <input className={inputCls} type="number" placeholder="0.00" value={form.price} onChange={set('price')} />
            </Field>
            <Field label="Discount (%)">
              <input className={inputCls} type="number" placeholder="0" value={form.discount} onChange={set('discount')} />
            </Field>
            <Field label="Stock *">
              <input className={inputCls} type="number" placeholder="0" value={form.stock} onChange={set('stock')} />
            </Field>
            <Field label="Product Type *">
              <select className={inputCls} value={form.product_type} onChange={set('product_type')}>
                <option value="">Select type</option>
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description *">
            <textarea
              rows={3}
              className={inputCls + ' resize-none'}
              placeholder="Product description..."
              value={form.description}
              onChange={set('description')}
            />
          </Field>

          <Field label="More Details">
            <textarea
              rows={2}
              className={inputCls + ' resize-none'}
              placeholder="Additional details..."
              value={form.more_details}
              onChange={set('more_details')}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
