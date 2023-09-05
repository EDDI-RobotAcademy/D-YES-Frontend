import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./css/Carousel.css";
import { Image } from "./entity/Image";

const images: Image[] = [
  { id: 1, url: "img/sampleImg4.jpg" },
  { id: 2, url: "img/sampleImg2.jpg" },
  { id: 3, url: "img/sampleImg3.jpg" },
  { id: 4, url: "img/sampleImg1.jpg" },
  { id: 5, url: "img/sampleImg5.jpg" },
];

const Carousel: React.FC = () => {
  const settings: Settings = {
    infinite: true, // 슬라이드 무한 반복
    fade: true, // fade 효과
    autoplay: true, // 자동으로 다음 슬라이드로
    autoplaySpeed: 3000, // autoplay의 지연 시간(ms)
    speed: 500, // 전환 속도
    slidesToShow: 1, // 한번에 보여지는 슬라이드 수
    slidesToScroll: 1, // 한번에 넘겨지는 슬라이드 수
    lazyLoad: "anticipated", // 현재 페이지의 전, 후 페이지를 로드해준다
  };
  return (
    <div>
      <Slider className="slider" {...settings}>
        {/* map을 사용해 images의 요소를 하나씩 뽑아옴 */}
        {images.map((image) => {
          return (
            <div className="slide-container" key={image.id}>
            <img className="slide-image" src={image.url} />
              {image.id === 1 && (
              <div>
                <p className="text-common-img">
                  지금 바로 수확한 토마토<br></br>
                  맛있누 냠냠
                </p>
                <p className="text-common-detail">
                  토마토마 특가 이벤트 2023.09.18까지
                </p>
              </div>
              )}
              {image.id === 2 && (
                <div>
                  <p className="text-common-img">
                    두번째 이미지에 대한 내용<br></br>
                    두번째
                  </p>
                  <p className="text-common-detail">
                    두번째 특가 이벤트 2023.09.18까지
                  </p>
                </div>
              )}
              {image.id === 3 && (
                <div>
                  <p className="text-common-img">
                    세번째 이미지에 대한 내용<br></br>
                    세번째
                  </p>
                  <p className="text-common-detail">
                    세번째 특가 이벤트 2023.09.18까지
                  </p>
                </div>
              )}
              {image.id === 4 && (
                <div>
                  <p className="text-common-img">
                    네번째 이미지에 대한 내용<br></br>
                    네번째
                  </p>
                  <p className="text-common-detail">
                    네번째 특가 이벤트 2023.09.18까지
                  </p>
                </div>
              )}
              {image.id === 5 && (
                <div>
                  <p className="text-common-img">
                    다섯번째 이미지에 대한 내용<br></br>
                    다섯번째
                  </p>
                  <p className="text-common-detail">
                    다섯번째 특가 이벤트 2023.09.18까지
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Carousel;
