import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/ProductCarousel.css";

interface ImageObject {
  id: number;
  url: string;
}

interface ProductCarouselProps {
  images: ImageObject[];
}

interface ProductCarouselState {
  nav1: Slider | undefined;
  nav2: Slider | undefined;
}

export default class ProductCarousel extends Component<ProductCarouselProps, ProductCarouselState> {
  private mainSlider: Slider | undefined = undefined;
  private detailSlider: Slider | undefined = undefined;

  constructor(props: ProductCarouselProps) {
    super(props);
    this.state = {
      nav1: undefined,
      nav2: undefined,
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.mainSlider,
      nav2: this.detailSlider,
    });
  }

  render() {
    const { images } = this.props;

    const mainImgSettings = {
      asNavFor: this.state.nav2,
      ref: (slider: Slider) => (this.mainSlider = slider),
    };

    const detailImgSettings = {
      asNavFor: this.state.nav1,
      ref: (slider: Slider) => (this.detailSlider = slider),
      slidesToShow: 5,
      focusOnSelect: true,
      swipeToSlide: true,
      centerMode: true,
    };

    return (
      <div>
        <Slider className="main-slider" {...mainImgSettings}>
          {images.map((image) => (
            <div key={image.id}>
              <img className="product-slide-image" src={image.url} alt={`mainImage ${image.id}`} />
            </div>
          ))}
        </Slider>
        <Slider className="detail-slider" {...detailImgSettings}>
          {images.map((image) => (
            <div key={image.id}>
              <div className="product-slide-image-margin">
                <img
                  className="product-slide-image"
                  src={image.url}
                  style={{ cursor: "pointer" }}
                  alt={`detailImage ${image.id}`}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
