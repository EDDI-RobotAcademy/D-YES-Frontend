import Carousel from "layout/carousel/Carousel";
import ProductRandomListPage from "page/product/ProductRandomListPage";
import React from "react";

import "./css/MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page">
      <Carousel />
      <ProductRandomListPage />
    </div>
  );
};

export default MainPage;
