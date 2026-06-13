import Link from "next/link";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-5">
          <FiCheckCircle className="text-green-500 text-7xl" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. Your order has been confirmed and
          will be processed shortly.
        </p>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full button-bg text-white py-3 rounded-xl font-semibold"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="block w-full border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <FiShoppingBag />
          <span>Secure Checkout Completed</span>
        </div>
      </div>
    </div>
  );
}