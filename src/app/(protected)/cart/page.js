"use client";
import React, { useEffect, useState } from "react";

import { fetchCart } from "../../redux/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "../../utils/commonApi";
import { showToast } from "../../utils/swal";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { FiTruck, FiShield } from "react-icons/fi";
import { fetchAddress } from "../../redux/slice/addressSlice";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/app/utils/skeleton";

const DELIVERY_CHARGE = 49;
const FREE_DELIVERY_ABOVE = 499;

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    address,
    loading: addressLoading,
    error: addressError,
  } = useSelector((state) => state.address);

  const {
    items: cartItems,
    loading,
    error,
  } = useSelector((state) => state.cart);

  const handleRemove = async (cartId) => {
    try {
      await apiRequest(`/api/cart/delete/${cartId}`, "delete");
      dispatch(fetchCart());
      showToast({ icon: "success", title: "Item removed" });
    } catch (e) {
      showToast({ icon: "error", title: "Failed to remove item" });
    }
  };

  const handleIncrease = async (cartId, quantity, stock) => {
    try {
      if (quantity >= stock) {
        return showToast({
          icon: "error",
          title: "Maximum stock reached",
        });
      }

      await apiRequest(`/api/cart/update/${cartId}`, "PUT", {
        qty: quantity + 1,
      });
      showToast({ icon: "success", title: "Item increased" });

      dispatch(fetchCart());
    } catch (error) {
      showToast({
        icon: "error",
        title: "Failed to update quantity",
      });
    }
  };

  const handleDecrease = async (cartId, quantity) => {
    try {
      if (quantity <= 1) {
        return showToast({
          icon: "error",
          title: "Minimum quantity is 1",
        });
      }

      await apiRequest(`/api/cart/update/${cartId}`, "PUT", {
        qty: quantity - 1,
      });
      showToast({ icon: "success", title: "Item decreased" });

      dispatch(fetchCart());
    } catch (error) {
      showToast({
        icon: "error",
        title: "Failed to update quantity",
      });
    }
  };

  const subtotal = cartItems?.reduce(
    (sum, d) => sum + (d?.productId?.price || 0) * (d?.quantity || 1),
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddress());
  }, [dispatch]);

  const handleVerificationAddress = () => {
    if (address.length === 0) {
      showToast({ icon: "error", title: "Please Add Address" });
      router.push("/address");
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return <SkeletonLoader variant="cart" loading={loading} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <FiShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/product"
          className="button-bg text-white px-8 py-3 rounded-full font-semibold mt-2 transition hover:opacity-90"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  console.log("items", cartItems);
  return (
    <div className="max-w-7xl mx-auto pt-6 md:pt-24 pb-12 px-4 md:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Shopping Cart{" "}
        <span className="text-gray-400 text-lg font-normal">
          ({cartItems.length} items)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems?.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 flex gap-3 sm:gap-4 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <Link
                href={`/product/${d?.productId?._id}`}
                className="flex-shrink-0"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100">
                  {d?.productId?.images?.[0] ? (
                    <Image
                      src={d.productId.images[0]}
                      alt={d?.productId?.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/product/${d?.productId?._id}`}>
                      <h3 className="font-semibold text-gray-900 truncate hover:text-indigo-600 transition">
                        {d?.productId?.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {d?.productId?.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(d._id)}
                    className="text-gray-400 hover:text-red-500 transition ml-2 flex-shrink-0"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <p className="text-base sm:text-lg font-bold text-indigo-600">
                    ₹{d?.productId?.price}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleDecrease(d._id, d.quantity)}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold"
                    >
                      −
                    </button>
                    <span className="px-1 text-sm">{d?.quantity}</span>
                    <button
                      onClick={() =>
                        handleIncrease(d?._id, d?.quantity, d?.productId?.stock)
                      }
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="text-right text-sm text-gray-500 mt-1">
                  Subtotal:{" "}
                  <span className="font-semibold text-gray-800">
                    ₹{(d?.productId?.price || 0) * (d?.quantity || 1)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-medium text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span
                  className={
                    delivery === 0
                      ? "text-green-600 font-semibold"
                      : "font-medium text-gray-800"
                  }
                >
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-indigo-500">
                  Add ₹{FREE_DELIVERY_ABOVE - subtotal} more for free delivery
                </p>
              )}
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="w-full mt-5 button-bg text-white py-3 rounded-full font-bold text-sm shadow hover:opacity-90 transition"
              onClick={handleVerificationAddress}
            >
              Proceed to Checkout →
            </button>

            <Link
              href="/product"
              className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3 transition"
            >
              ← Continue Shopping
            </Link>

            {/* Trust */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiTruck size={13} className="text-indigo-500" />
                <span>
                  Free delivery on orders above ₹{FREE_DELIVERY_ABOVE}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiShield size={13} className="text-indigo-500" />
                <span>Secure & encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
