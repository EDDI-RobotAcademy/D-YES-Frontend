import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./css/Carousel.css";
import { Image } from "./entity/Image";

const images: Image[] = [
  { id: 1, url: "img/main_carousel_img1.jpg" },
  { id: 2, url: "img/main_carousel_img4.jpg" },
  { id: 3, url: "img/main_carousel_img3.jpg" },
  { id: 4, url: "img/main_carousel_img2.jpg" },
  { id: 5, url: "img/main_carousel_img5.jpg" },
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
                  나만의 특별 레시피 공유하기<br></br>
                  나만 아는 꿀조합!
                </p>
                <p className="text-common-detail">
                  레시피 공유 이벤트 2023.10.12까지
                </p>
              </div>
              )}
              {image.id === 2 && (
              <div>
                <p className="text-common-img">
                  구황작물의 계절이 돌아왔어요<br></br>
                  건강한 포만감
                </p>
                <p className="text-common-detail">
                  감자&고구마 골라담기
                </p>
              </div>
              )}
              {image.id === 3 && (
                <div>
                  <p className="text-common-img">
                    매일 아침, 우리 가족을 위한<br></br>
                    건강한 당근 주스
                  </p>
                  <p className="text-common-detail">
                    당근 구매시 착즙 주스 포함
                  </p>
                </div>
              )}
              {image.id === 4 && (
                <div>
                  <p className="text-common-img">
                    달달함 UP! 건강한 단 맛<br></br>
                    스테비아 토마토
                  </p>
                  <p className="text-common-detail">
                    산지의 신선함 그대로
                  </p>
                </div>
              )}
              {image.id === 5 && (
                <div>
                  <p className="text-common-img">
                    할로윈 호박을 찾아주세요<br></br>
                    최대 2만원 할인
                  </p>
                  <p className="text-common-detail">
                    사이트 곳곳에 있는 할로윈 호박을 클릭!
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
