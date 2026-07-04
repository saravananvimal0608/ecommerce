"use client";
import React, { useEffect, useState, Suspense } from "react";
import { apiRequest } from "../utils/commonApi";
import Image from "next/image";
import { useSearch } from "../context/SearchContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../utils/skeleton";
import NoDataFound from "../components/NoDataFound";

const LIMIT = 16;

const ProductPageContent = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState(10000);
  const [filterOpen, setFilterOpen] = useState(false);
  const { search } = useSearch(); // context hook navbar search state changes reflect in this page
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(totalProduct / LIMIT);
  const categoryId = searchParams.get("category");

  const handleFetchCategories = async () => {
    try {
      const res = await apiRequest("/api/category/getAllCategory");
      setCategories(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFetchProducts = async () => {
    try {
      const res = await apiRequest(
        `/api/product/all?limit=${LIMIT}&page=${page}&search=${search}&maxPrice=${price}`,
      );
      setTotalProduct(res.totalProducts);
      setProducts(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchByCategories = async (categoryId, currentPage = 1) => {
    try {
      const res = await apiRequest(
        `/api/product/productByCategory/${categoryId}?page=${currentPage}&limit=${LIMIT}&maxPrice=${price}`,
      );
      setTotalProduct(res.totalProducts);
      setProducts(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, price]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    const currentCategory = categoryId || selectedCategory;

    if (currentCategory) {
      handleFetchByCategories(currentCategory, page);
    } else {
      handleFetchProducts();
    }
  }, [page, search, selectedCategory, categoryId, price]);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  const FilterContent = () => (
    <>
      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => { setSelectedCategory(""); router.push("/product"); setFilterOpen(false); }}
              className="accent-indigo-600"
            />
            <span className="text-sm">All</span>
          </label>
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category._id}
                onChange={() => { setSelectedCategory(category._id); setFilterOpen(false); }}
                className="accent-indigo-600"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-3">Price Range</h3>
        <input
          type="range" min="0" max="10000" value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>₹0</span>
          <span>₹{price}</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Drawer Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-5 overflow-y-auto z-50 mt-[100px] md:mt-0">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      <div className="my-6 w-full px-4 md:px-6 flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0 bg-white shadow-lg rounded-xl p-5 h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-5">Filters</h2>
          <FilterContent />
        </div>

        {/* Products */}
        <div className="flex-1 min-w-0 mt-[40px] md:mt-0">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {(selectedCategory || price < 10000) && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>
              )}
            </button>
            <p className="text-sm text-gray-500">{totalProduct} results</p>
          </div>
          {loading ? (
            <SkeletonLoader variant="productPage" loading={loading} />
          ) : products.length === 0 ? <NoDataFound /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products?.map((product) => (
                <Link href={`/product/${product._id}`} key={product._id}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {product?.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product?.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {product?.category?.map((d) => d.name).join(", ")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 elipsis-description">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-lg font-bold text-indigo-600">
                          ₹{product.price}
                        </span>
                        <span className="button-bg text-white px-3 py-1 rounded-lg text-xs font-medium">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>

              {page > 3 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
                  >
                    1
                  </button>
                  <span className="text-gray-400 px-1">...</span>
                </>
              )}

              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${p === page
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              ))}

              {page < totalPages - 2 && (
                <>
                  <span className="text-gray-400 px-1">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 transition"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <p className="text-center text-sm text-gray-400 mt-3">
              Page {page} of {totalPages}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const ProductPage = () => (
  <Suspense fallback={<SkeletonLoader variant="productPage" loading={true} />}>
    <ProductPageContent />
  </Suspense>
);

export default ProductPage;
