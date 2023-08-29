import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./css/ProductCarousel.css";
import { Image } from "./entity/Image";
import { useEffect, useRef } from "react";

interface CarouselProps {
  images: Image[];
  settings: Settings;
  initialImageIndex?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, settings, initialImageIndex }) => {
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    if (sliderRef.current && initialImageIndex !== undefined) {
      sliderRef.current.slickGoTo(initialImageIndex);
    }
  }, [initialImageIndex]);

  return (
    <div>
      <Slider ref={sliderRef} className="product-slider" {...settings}>
        {images.map((image) => {
          return (
            <div className="product-slide-container" key={image.id}>
              <img className="product-slide-image" src={image.url} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
