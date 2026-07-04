"use client";
import React, { useState, useEffect } from "react";
import Swipper from "./Swipper";
import Link from "next/link";
import { apiRequest } from "../utils/commonApi";
import NoDataFound from "./NoDataFound";

const TopSellerProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getAllData = async () => {
    try {
      const res = await apiRequest("/api/product/allTopProduct", "get");
      setData(res.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Top Selling Products
        </h2>
        <Link
          href="/product"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
        >
          See All
        </Link>
      </div>
      {loading ? (
        <Swipper data={data} variant="product" loading={loading} />
      ) : error ? (
        <p className="text-center text-red-500 py-6">Something went wrong. Please try again later.</p>
      ) : data.length === 0 ? (
        <div className="flex justify-center">
          <NoDataFound message="No Top Selling Products Found" />
        </div>
      ) : (
        <Swipper data={data} variant="product" loading={loading} />
      )}
    </section>
  );
};

export default TopSellerProducts;
