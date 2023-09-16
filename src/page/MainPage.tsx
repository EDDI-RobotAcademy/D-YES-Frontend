import Carousel from "layout/carousel/Carousel";
import ProductRandomListPage from "page/product/ProductRandomListPage";
import "./css/MainPage.css";
import PriceListPage from "./farm/PriceListPage";

const MainPage = () => {
  return (
    <div className="main-page">
      <p>빌드</p>
      <Carousel />
      <ProductRandomListPage />
      <PriceListPage />
    </div>
  );
};

export default MainPage;
