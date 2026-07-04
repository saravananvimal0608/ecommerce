"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCart } from "../../redux/slice/cartSlice";
import { fetchAddress } from "../../redux/slice/addressSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMapPin,
  FiPlus,
  FiCheckCircle,
  FiShield,
  FiPackage,
} from "react-icons/fi";
import { showToast } from "../../utils/swal";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "../../utils/commonApi";
import SkeletonLoader from "@/app/utils/skeleton";

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Store selected address id
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Store buy now product
  const [buyNowItem, setBuyNowItem] = useState(null);

  // Show payment popup
  const [modeOfPayment, setModeOfPayment] = useState(false);

  // Store selected payment method
  const [paymentMethod, setPaymentMethod] = useState("");

  // Get checkout type from url
  const type = searchParams.get("type");

  // Get address data from redux
  const { address, loading: addressLoading } = useSelector(
    (state) => state.address,
  );

  // Get cart data from redux
  const { items: cartItems, loading } = useSelector((state) => state.cart);

  // Load address and cart data when page opens
  useEffect(() => {
    dispatch(fetchAddress());
    dispatch(fetchCart());
  }, [dispatch]);

  // Automatically select first address
  useEffect(() => {
    if (address?.length > 0 && !selectedAddress) {
      setSelectedAddress(address[0]._id);
    }
  }, [address]);

  // Show buy now product or cart products
  const checkoutItems =
    type === "buyNow"
      ? buyNowItem
        ? [{ productId: buyNowItem, quantity: 1 }]
        : []
      : cartItems;

  // Calculate subtotal
  const subtotal = checkoutItems?.reduce(
    (sum, d) => sum + (d?.productId?.price || 0) * (d?.quantity || 1),
    0,
  );

  const total = subtotal;

  // Cash on Delivery API
  const codPaymentApi = async () => {
    try {
      const res = await apiRequest("/api/order/cod", "post", {
        list_items: checkoutItems,
        addressId: selectedAddress,
      });

      if (res?.success) {
        // Remove buy now product after successful order
        if (type === "buyNow") {
          localStorage.removeItem("buyNowProduct");
        } else {
          // Refresh cart
          dispatch(fetchCart());
        }

        showToast({
          icon: "success",
          title: "Order placed successfully",
        });

        // Redirect to success page
        router.push("/order-success");
      }
    } catch (error) {
      console.log(error);

      showToast({
        icon: "error",
        title: "Failed to place order",
      });
    }
  };

  // Open Razorpay popup
  const openRazorpay = (data) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: data.razorpay_order.amount,

      currency: "INR",

      order_id: data.razorpay_order.id,

      name: "My Ecommerce",

      description: "Product Purchase",

      // Called after successful payment
      handler: async function (response) {
        await verifyPayment(response);
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  // Verify payment from backend
  const verifyPayment = async (razorpayResponse) => {
    try {
      const res = await apiRequest("/api/order/webhook", "post", {
        razorpay_order_id: razorpayResponse.razorpay_order_id,

        razorpay_payment_id: razorpayResponse.razorpay_payment_id,

        razorpay_signature: razorpayResponse.razorpay_signature,

        list_items: checkoutItems,

        addressId: selectedAddress,
      });

      if (res.success) {
        showToast({
          icon: "success",
          title: "Payment Successful",
        });

        // Remove buy now product
        if (type === "buyNow") {
          localStorage.removeItem("buyNowProduct");
        } else {
          // Refresh cart
          dispatch(fetchCart());
        }

        // Redirect to success page
        router.push("/order-success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Create Razorpay order
  const razorpayPaymentApi = async () => {
    try {
      const res = await apiRequest("/api/order/onlinePayment", "post", {
        list_items: checkoutItems,
        addressId: selectedAddress,
      });

      if (res.success) {
        openRazorpay(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle order placement
  const handlePlaceOrder = () => {
    // Address validation
    if (!selectedAddress) {
      showToast({
        icon: "error",
        title: "Please select a delivery address",
      });
      return;
    }

    // COD payment
    if (paymentMethod === "COD") {
      codPaymentApi();
    }

    // Online payment
    if (paymentMethod === "UPI") {
      razorpayPaymentApi();
    }
  };

  // Get buy now product from localStorage
  useEffect(() => {
    if (type === "buyNow") {
      const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

      setBuyNowItem(buyNowProduct);
    }
  }, [type]);

console.log('cartItems',cartItems)


  if (loading || addressLoading) {
    return <SkeletonLoader variant="checkout" loading={loading} />;
  }

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-12 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiMapPin className="text-indigo-500" /> Delivery Address
              </h2>
              <Link
                href="/address"
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 px-3 py-1.5 rounded-lg transition hover:bg-indigo-50"
              >
                <FiPlus size={12} /> Add New
              </Link>
            </div>

            {address?.length === 0 ? (
              <div className="text-center py-6">
                <FiMapPin size={36} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-3">
                  No saved address found
                </p>
                <Link
                  href="/address"
                  className="button-bg text-white px-6 py-2 rounded-full text-sm font-semibold inline-block"
                >
                  + Add Address
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {address.map((d) => (
                  <label
                    key={d._id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === d._id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-100 hover:border-indigo-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mt-1 accent-indigo-600"
                      checked={selectedAddress === d._id}
                      onChange={() => setSelectedAddress(d._id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 text-sm">
                          {d.address_line}
                        </p>
                        {selectedAddress === d._id && (
                          <FiCheckCircle
                            size={14}
                            className="text-indigo-500"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{d.city}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        PH : {d.mobile}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FiPackage className="text-indigo-500" /> Order Items (
              {checkoutItems?.length})
            </h2>
            <div className="space-y-4">
              {checkoutItems?.map((d) => (
                <div key={d._id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {d?.productId?.images?.[0] ? (
                      <Image
                        src={d.productId.images[0]}
                        alt={d.productId.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {d?.productId?.name} × {d?.quantity}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {d?.productId?.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-indigo-600 text-sm">
                      ₹{(d?.productId?.price || 0) * (d?.quantity || 1)}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{d?.productId?.price} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            {/* Item breakdown */}
            <div className="space-y-2 mb-4">
              {checkoutItems?.map((d) => (
                <div
                  key={d._id}
                  className="flex justify-between text-xs text-gray-500"
                >
                  <span className="truncate max-w-[140px]">
                    {d?.productId?.name} × {d?.quantity}
                  </span>
                  <span className="font-medium text-gray-700">
                    ₹{(d?.productId?.price || 0) * (d?.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-gray-100 mb-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({checkoutItems?.length} items)</span>
                <span className="font-medium text-gray-800">₹{subtotal}</span>
              </div>
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="flex justify-between text-base font-bold text-gray-900 mb-5">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setModeOfPayment(true)}
                disabled={!selectedAddress || checkoutItems?.length === 0}
                className="w-full button-bg text-white py-3 rounded-full font-bold text-sm shadow hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Place Order →
              </button>

              {modeOfPayment && (
                <div className="absolute bottom-16 left-0 w-full bg-white border rounded-xl shadow-lg p-4 z-50">
                  <p className="font-semibold text-gray-700 mb-3">
                    Select Payment Method
                  </p>

                  <label className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash On Delivery</span>
                  </label>

                  <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>UPI / Razorpay</span>
                  </label>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={!paymentMethod}
                    className="w-full bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                  >
                    Confirm Order
                  </button>
                </div>
              )}
            </div>

            <Link
              href={type === "buyNow" ? "product" : "/cart"}
              className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-3 transition"
            >
              ← Back to {type === "buyNow" ? "Product" : "Cart"}
            </Link>

            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
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

export default Checkout;
