import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./css/Carousel.css";
import { Image } from "./entity/Image";

const images: Image[] = [
  { id: 1, url: "img/sampleImg1.jpg" },
  { id: 2, url: "img/sampleImg2.jpg" },
  { id: 3, url: "img/sampleImg3.jpg" },
  { id: 4, url: "img/sampleImg4.jpg" },
  { id: 5, url: "img/sampleImg5.jpg" },
];

const Carousel: React.FC = () => {
  const settings: Settings = {
    dots: true, // 아래에 점 표시
    infinite: true, // 슬라이드 무한 반복
    fade: true, // fade 효과
    autoplay: true, // 자동으로 다음 슬라이드로
    autoplaySpeed: 3000, // autoplay의 지연 시간(ms)
    speed: 500, // 전환 속도
    slidesToShow: 1, // 한번에 보여지는 슬라이드 수
    slidesToScroll: 1, // 한번에 넘겨지는 슬라이드 수
    lazyLoad: "anticipated",
  };
  return (
    <div>
      <Slider className="slider" {...settings}>
        {images.map((image) => {
          return (
            <div className="slide-container" key={image.id}>
              <img className="slide-image" src={image.url} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
