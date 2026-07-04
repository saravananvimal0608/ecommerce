import React from "react";
import Swipper from "./Swipper";
import bannerImg from "../assets/banner-1.png";
import OfferProducts from "./OfferProducts";
import FeaturedCategories from "./FeaturedCategories";
import TrendingProducts from "./TrendingProducts";
import BestSellerProducts from "./BestSeller";
import TopSellerProducts from "./TopProducts";

const HomePage = () => {
  const data = [
    {
      id: 1,
      img: bannerImg,
      alt: "banner 1",
      para1: "Welcome to our online store",
      para2: "Shop the latest trends with exclusive deals and offers.",
      heading1: "Discover Amazing Products",
      heading2: "Save up to 50% off",
      link: "/product",
    },
    {
      id: 2,
      img: bannerImg,
      alt: "banner 2",
      para1: "Welcome to our online store",
      para2: "Shop the latest trends with exclusive deals and offers.",
      heading1: "Discover Amazing Products",
      heading2: "Save up to 50% off",
      link: "/product",
    },
    {
      id: 3,
      img: bannerImg,
      alt: "banner 3",
      para1: "Welcome to our online store",
      para2: "Shop the latest trends with exclusive deals and offers.",
      heading1: "Discover Amazing Products",
      heading2: "Save up to 50% off",
      link: "/product",
    },
  ];

  return (
    <div>
      <Swipper data={data} content />

      <OfferProducts />

      <FeaturedCategories />

      <TrendingProducts />

      <BestSellerProducts />

      <TopSellerProducts />
    </div>
  );
};

export default HomePage;
