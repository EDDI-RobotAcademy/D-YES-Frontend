import Carousel from "layout/carousel/Carousel";
import Button from "layout/button/Button";
import React from "react";

import "./css/MainPage.css";

const MainPage = () => {
  return (
    <div className="main-page">
      <Carousel />
      <Button />
    </div>
  );
};

export default MainPage;