"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  FreeMode,
  Navigation,
  Thumbs,
} from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { CiShoppingCart } from "react-icons/ci";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SkeletonLoader from "../utils/skeleton";
import NoDataFound from "./NoDataFound";

export default function Swipper({ data = [], variant = "banner", loading }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (loading) {
    return <SkeletonLoader variant={variant} />;
  }

  if (variant === "thumbs") {
    return (
      <div>
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="rounded-2xl overflow-hidden mb-3"
        >
          {data.map((item) => (
            <SwiperSlide key={item._id}>
              <Link href={`/product/${item._id}`}>
                <div className="relative h-80 w-full">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-semibold truncate">{item.name}</h3>
                    <p className="text-white font-bold">₹{item.price}</p>
                  </div> */}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper"
        >
          {data.map((item) => (
            <SwiperSlide
              key={item._id}
              className="cursor-pointer opacity-50 [&.swiper-slide-thumb-active]:opacity-100"
            >
              <div className="relative h-20 rounded-lg overflow-hidden">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (variant === "images") {
    return (
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        className="rounded-2xl overflow-hidden"
      >
        {data.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-72">
              <Image src={src} alt={`image-${i}`} fill className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  if (variant === "product") {
    if (data.length === 0) return <NoDataFound message="No Related Products Found" />;
    return (
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="py-4"
      >
        {data.map((item) => (
          <SwiperSlide key={item._id}>
            <Link href={`/product/${item._id}`}>
              <div className="group bg-white rounded overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer p-2">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Price Badge */}
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                    ₹{item.price}
                  </div>

                  <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    <CiShoppingCart size={24} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 elipsis-description">
                    {item.description}
                  </p>

                  <p className="text-xl font-bold text-indigo-600">
                    ₹{item.price}
                  </p>

                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition">
                    Shop Now
                  </button>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  // default: banner
  console.log("data length", data)
  return (
    <>
      {data.length === 0 ? <NoDataFound /> :
        <div className="relative">
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="h-[55vw] min-h-[280px] max-h-screen"
          >
            {data.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative h-[55vw] min-h-[280px] max-h-screen w-full">
                  <Image
                    src={item.img}
                    alt={item.alt || "Banner"}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  <div className="absolute left-5 sm:left-10 md:left-20 top-1/2 -translate-y-1/2 z-10 max-w-[60%] sm:max-w-xl text-white">
                    <p className="mb-1 sm:mb-2 text-xs sm:text-sm md:text-base tracking-wider uppercase">
                      {item.para1}
                    </p>
                    <h1 className="text-xl sm:text-4xl md:text-6xl font-bold leading-tight">
                      {item.heading1}
                    </h1>
                    {item.heading2 && (
                      <h2 className="mt-1 sm:mt-2 text-base sm:text-2xl md:text-4xl font-semibold">
                        {item.heading2}
                      </h2>
                    )}
                    <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-lg text-white/80 hidden sm:block">
                      {item.para2}
                    </p>
                    {item.link && (
                      <div className="mt-4 sm:mt-8">
                        <Link
                          href={item.link}
                          className="inline-block rounded-full bg-white px-4 sm:px-8 py-2 sm:py-3 text-black text-xs sm:text-base font-medium transition hover:scale-105"
                        >
                          Shop Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </>
  );
}
