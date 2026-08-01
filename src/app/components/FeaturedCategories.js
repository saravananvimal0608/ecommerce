"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/commonApi";
import Link from "next/link";
import SkeletonLoader from "../utils/skeleton";
import NoDataFound from "./NoDataFound";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [toggle, setToggle] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getAllCategory = async () => {
    try {
      const res = await apiRequest("/api/category/getAllCategory", "get");
      setCategories(res.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const displayCategories = toggle ? categories : categories.slice(0, 8);

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Featured Categories</h1>

        <p
          className="text-blue-600 cursor-pointer"
          onClick={() => setToggle(!toggle)}
        >
          {toggle ? "Show Less" : "See All"}
        </p>
      </div>

      {loading ? (
        <SkeletonLoader variant="category" loading={loading}/>
      ) : error ? (
       <div className="flex justify-center">
          <NoDataFound message="Something went wrong. Please try again later." />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex justify-center">
          <NoDataFound message="No Categories Found" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-xl
        hover:shadow-2xl hover:-translate-y-2
        transition-all duration-300 cursor-pointer"
            >
              <Link href={`/product?category=${category._id}`}>
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-center line-clamp-2">
                  {category.name}
                </h2>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCategories;
