"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/commonApi";
import { FiPackage, FiMapPin, FiPhone, FiCalendar } from "react-icons/fi";
import SkeletonLoader from "@/app/utils/skeleton";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderData = async () => {
    try {
      const res = await apiRequest("/api/order/getOrderDetails", "get");

      if (res.success) {
        setOrders(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    orderData();
  }, []);

  if (loading) {
    return <SkeletonLoader variant="orders" loading={loading} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-15 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <FiPackage size={30} className="text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FiPackage size={60} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No Orders Yet</h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't placed any orders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 border-b px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>

                  <div className="flex items-center gap-2 text-gray-700">
                    <FiCalendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.payment_status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>

                    <h3 className="text-2xl font-bold text-indigo-600">
                      ₹{order.total_amt}
                    </h3>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Delivery Address
                    </p>

                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-start gap-2">
                        <FiMapPin className="mt-1 flex-shrink-0" />
                        <span>
                          {order.delivery_address?.address_line},{" "}
                          {order.delivery_address?.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiPhone />
                        <span>{order.delivery_address?.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
