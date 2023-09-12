import Carousel from "layout/carousel/Carousel";
import ProductRandomListPage from "page/product/ProductRandomListPage";
import React from "react";
import PriceListPage from "./farmProduce/PriceListPage";

import "./css/MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page">
      <Carousel />
      <ProductRandomListPage />
      <PriceListPage />
    </div>
  );
};

export default MainPage;
