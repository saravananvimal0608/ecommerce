"use client";
import { apiRequest } from "@/app/utils/commonApi";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { showToast } from "@/app/utils/swal";
import {
  FiShoppingCart,
  FiZap,
  FiTruck,
  FiShield,
  FiRotateCcw,
} from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import Swipper from "../../components/Swipper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchCart } from "../../redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import SkeletonLoader from "@/app/utils/skeleton";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showRating, setShowRating] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const ratingRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPosition({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const handleFetch = async () => {
    try {
      const res = await apiRequest(`/api/product/singleProduct/${id}`);
      setProduct(res.data);
      if (res.data?.images?.length > 0) setSelectedImage(res.data.images[0]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ icon: "error", title: "Please login first" });
      router.push("/login");
      return;
    }
    if (!selectedRating) {
      showToast({ icon: "error", title: "Please select a rating" });
      return;
    }
    try {
      setSubmitting(true);
      const res = await apiRequest(`/api/product/rating/${id}`, "post", {
        rating: selectedRating,
      });
      showToast({ icon: "success", title: "Rating submitted!" });
      setProduct((prev) => ({ ...prev, rating: res.averageRating }));
      setShowRating(false);
      setSelectedRating(0);
    } catch (e) {
      showToast({ icon: "error", title: "Failed to submit rating" });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleAddCart = async () => {
    try {
      const res = await apiRequest("/api/cart/add", "post", { productId: id });
      showToast({ icon: "success", title: res?.message });
      dispatch(fetchCart());
    } catch (e) {
      showToast({ icon: "error", title: e.response?.data?.message });
    }
  };

  const handleBuyNow = (product) => {
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    router.push("/checkout?type=buyNow");
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (ratingRef.current && !ratingRef.current.contains(e.target)) {
        setShowRating(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleRelatedProduct = async () => {
    try {
      const res = await apiRequest(`/api/product/relatedProducts/${id}`);
      setRelatedProduct(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (id) {
      handleFetch();
      handleRelatedProduct();
    }
  }, [id]);

  const filteredImage = product?.images?.slice(1);
  const galleryImages = product.product_type === "best-seller" ? filteredImage : product?.images;
  const inStock = product?.stock > 0;
  const avgRating = product?.rating || 0;

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
      />
    ));

  if (loading) {
    return <SkeletonLoader variant="singleProduct" loading={loading} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 lg:pt-15 pb-12 w-full">
      {/* Mobile image swiper — hidden on desktop */}
      <div className="block lg:hidden mb-4 rounded-2xl overflow-hidden">
        <Swipper data={product?.images || []} variant="images" />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Thumbnail column — desktop only */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-2">
          {galleryImages?.map((img, index) => (
            <div
              key={index}
              onMouseEnter={() => setSelectedImage(img)}
              className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${selectedImage === img
                  ? "border-indigo-500 shadow-md"
                  : "border-gray-200 hover:border-indigo-300"
                }`}
            >
              <Image
                src={img}
                alt={`thumb-${index}`}
                width={64}
                height={64}
                className="w-16 h-16 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main image — desktop only */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div
            className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
          >
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={product?.name}
                width={600}
                height={600}
                className="w-full h-[500px] object-cover"
              />
            )}
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          </div>

          {/* Zoom preview — desktop only */}
          {showZoom && selectedImage && (
            <div className="absolute left-[calc(100%+16px)] top-0 w-[420px] h-[500px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl z-50">
              <div
                className="w-full h-full bg-no-repeat"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: "280%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mb-1">
              {product?.product_type}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product?.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-sm">{renderStars(avgRating)}</div>
              <span className="text-sm text-gray-500">
                ({avgRating.toFixed(1)}) · {product?.ratings?.length || 0} reviews
              </span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              ₹{product?.price}
            </p>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{product?.description}</p>

          <hr className="border-gray-200" />

          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 w-28">Category:</span>
              <span className="text-gray-600">
                {product?.category?.map((c) => c.name).join(", ")}
              </span>
            </div>
            {product?.subCategory?.length > 0 && (
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 w-28">Sub Category:</span>
                <span className="text-gray-600">
                  {product.subCategory.map((s) => s.name).join(", ")}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 w-28">Availability:</span>
              <span className={inStock ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                {inStock ? `In Stock (${product?.stock} left)` : "Out of Stock"}
              </span>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex items-center">
            <div className="relative" ref={ratingRef}>
              <button
                onClick={() => setShowRating((prev) => !prev)}
                className="flex items-center gap-2 border border-yellow-400 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <FaStar size={14} /> Rate this product
              </button>

              {showRating && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-12 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 w-64">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Your Rating</h4>
                  <div className="flex gap-1 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setSelectedRating(star)}
                        className="text-2xl transition-transform hover:scale-125"
                      >
                        {star <= (hoveredStar || selectedRating) ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-gray-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-500 mb-4">
                    {selectedRating
                      ? `You selected ${selectedRating} star${selectedRating > 1 ? "s" : ""}`
                      : "Click a star to rate"}
                  </p>
                  <button
                    onClick={handleSubmitRating}
                    disabled={submitting || !selectedRating}
                    className="w-full button-bg text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition"
                  >
                    {submitting ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-full transition-all duration-200 shadow hover:shadow-md"
              onClick={handleAddCart}
            >
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 button-bg text-white font-bold py-3 rounded-full transition-all duration-200 shadow hover:shadow-md"
              onClick={() => handleBuyNow(product)}
            >
              <FiZap size={18} /> Buy Now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { icon: <FiTruck size={18} />, label: "Free Delivery", sub: "On orders above ₹499" },
              { icon: <FiRotateCcw size={18} />, label: "Easy Returns", sub: "7 day return policy" },
              { icon: <FiShield size={18} />, label: "Secure Payment", sub: "100% protected" },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center border border-gray-200 rounded-xl p-3 bg-white shadow-sm"
              >
                <span className="text-indigo-600 mb-1">{icon}</span>
                <span className="text-xs font-semibold text-gray-800">{label}</span>
                <span className="text-[10px] text-gray-500">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-10 lg:mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Related Products</h2>
          <Link href="/product" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
            See All
          </Link>
        </div>
        <Swipper data={relatedProduct} variant="product" />
      </section>
    </div>
  );
};

export default ProductPage;
