import React, { useEffect, useRef, useState } from "react";
import Carousel from "./carousel/ProductCarousel";
import { Image } from "./carousel/entity/Image";
import { Settings } from "react-slick";
import { won } from "utility/filters/wonFilter";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getProductDetail, useProductDetailQuery } from "../api/ProductApi";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "utility/s3/awsS3";

import "./css/ProductDetail.css";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<RouteParams>();
  const { data } = useProductDetailQuery(productId || "");
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await getProductDetail(productId || "");
      // console.log("읽기 확인", data);
      // console.log("옵션 확인", data?.optionList);
      // console.log("이미지확인", data?.mainImage.mainImg);
      // console.log("디테일이미지확인", data?.detailImagesList);
      setIsLoading(false);
      if (data?.optionList && data.optionList.length > 0) {
        setSelectedOptionId(data.optionList[0].optionId!);
      }
    };
    fetchProductData();
  }, []);

  const handleDecreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setProductQuantity(productQuantity + 1);
  };

  // 임시 이미지
  const productDetailImages: Image[] = [
    { id: 1, url: getImageUrl("detailImg1.jpg") },
    { id: 2, url: getImageUrl("detailImg2.jpg") },
    { id: 3, url: getImageUrl("detailImg3.jpg") },
    { id: 4, url: getImageUrl("detailImg4.jpg") },
    { id: 5, url: getImageUrl("detailImg5.jpg") },
  ];

  const handleImageClick = (idx: number) => {
    setSelectedImageIndex(idx);
  };

  const productDetailSettings: Settings = {
    infinite: true, // 슬라이드 무한 반복
    speed: 500, // 전환 속도
    slidesToShow: 1, // 한번에 보여지는 슬라이드 수
    slidesToScroll: 1, // 한번에 넘겨지는 슬라이드 수
    lazyLoad: "anticipated", // 현재 페이지의 전, 후 페이지를 로드해준다
  };

  const tagMapping: { [key: string]: { className: string; name: string } } = {
    ORGANIC: { className: "tag-organic", name: "유기농" },
    PESTICIDE_FREE: { className: "tag-pesticide-free", name: "무농약" },
    ENVIRONMENT_FRIENDLY: { className: "tag-environment-friendly", name: "친환경" },
  };

  const selectedOption =
    data && data.optionList.find((option) => option.optionId === selectedOptionId);

  const yDetail = useRef<HTMLDivElement>(null);
  const yReview = useRef<HTMLDivElement>(null);
  const onMoveDetail = () => {
    yDetail.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onMoveReview = () => {
    yReview.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="product-detail-container">
      <div className="product-datail-main">
        <div className="product-info-grid">
          <div style={{ overflow: "hidden" }}>
            <div className="product-main-image">
              <div className="product-details">
                <Carousel
                  images={productDetailImages}
                  settings={productDetailSettings}
                  initialImageIndex={selectedImageIndex}
                />
                <div className="product-images">
                  <img
                    className="main-image-relative"
                    src={getImageUrl(`${data?.mainImage.mainImg}`)}
                    alt="메인 상품"
                    style={{ width: "65.2px", height: "65.2px", cursor: "pointer" }}
                    onClick={() => handleImageClick(0)}
                  />
                  {data?.detailImagesList?.map((detailImg, idx) => (
                    <img
                      key={idx}
                      className="detail-image-relative"
                      src={getImageUrl(`${detailImg.detailImgs}`)}
                      alt={`상세 상품 ${idx + 1}`}
                      style={{ width: "65.2px", height: "65.2px", cursor: "pointer" }}
                      onClick={() => handleImageClick(idx + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="product-name">{data?.productResponse.productName}</div>
              <div className="spacer-2" />
              <div className="product-option-price">
                {selectedOption ? won(selectedOption.optionPrice) : ""}
              </div>
              <div className="spacer-3" />
              {data?.productResponse.cultivationMethod &&
                data?.productResponse.cultivationMethod.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "4px",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      data-testid="cultivation-method"
                      className={`${
                        tagMapping[data?.productResponse.cultivationMethod]?.className
                      } tag-common`}
                    >
                      {tagMapping[data?.productResponse.cultivationMethod]?.name ||
                        data?.productResponse.cultivationMethod}
                    </div>
                  </div>
                )}
            </div>
            <hr className="hr-style" />
            <div className="spacer-3" />
            <FormControl fullWidth>
              <div className="choose-option">옵션을 선택해주세요</div>
              <Select
                value={selectedOptionId !== null ? selectedOptionId.toString() : ""}
                onChange={(e) => setSelectedOptionId(parseInt(e.target.value))}
                style={{ fontFamily: "SUIT-Medium" }}
              >
                {data?.optionList.map((option, idx) => (
                  <MenuItem
                    key={idx}
                    value={option.optionId.toString()}
                    disabled={option.stock === 0}
                    style={{ fontFamily: "SUIT-Medium" }}
                  >
                    {option.stock === 0 && (
                      <span
                        style={{
                          color: "red",
                          marginRight: "5px",
                          fontFamily: "SUIT-Bold",
                          display: "flex",
                        }}
                      >
                        품절
                      </span>
                    )}
                    <div className="options-style">
                      {option.optionName + " / " + option.value + option.unit}
                      <span>{won(option.optionPrice)}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="spacer-3" />
            <div className="product-quantity">
              총 상품 가격
              <span className="product-price-sum">
                <div className="product-counter-button">
                  <div className="product-button" onClick={handleDecreaseQuantity}>
                    <RemoveIcon />
                  </div>
                  <span className="product-counter">{productQuantity}</span>
                  <div className="product-button" onClick={handleIncreaseQuantity}>
                    <AddIcon />
                  </div>
                </div>
                <div className="price-sum">
                  {selectedOption ? won(selectedOption.optionPrice * productQuantity) : 0}
                </div>
              </span>
            </div>
            <div>
              <Button
                style={{ fontFamily: "SUIT-Bold", fontSize: "large" }}
                className="confirm-button"
                variant="outlined"
              >
                장바구니
              </Button>
            </div>
            <div className="spacer-1" />
            <div>
              <Button
                style={{ fontFamily: "SUIT-Bold", fontSize: "large" }}
                className="confirm-button"
                variant="contained"
              >
                구매하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="product-description-container">
        <div className="sticky-header-container">
          <div className="sticky-header">
            <div className="sticky-header-elements">
              <div className="sticky-header-nav">
                <div className="sticky-header-button" onClick={onMoveDetail}>
                  상세 정보
                </div>
                <div className="sticky-header-button" onClick={onMoveReview}>
                  리뷰
                </div>
              </div>
              <div className="sticky-header-options"></div>
            </div>
          </div>
        </div>
        <div className="example1" ref={yDetail}>
          <div className="example-container">
            상세 정보
            {/* 여기에 상세 정보 작성하세요 */}
            <div>
              <div className="product-details">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="farm-info table">
                    <TableHead>
                      <TableRow>
                        <TableCell>상호명</TableCell>
                        <TableCell>전화</TableCell>
                        <TableCell>주소</TableCell>
                        <TableCell>소개</TableCell>
                        <TableCell>분류</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={data?.farmInfoResponse.farmName}>
                        <TableCell>{data?.farmInfoResponse.farmName}</TableCell>
                        <TableCell>{data?.farmInfoResponse.csContactNumber}</TableCell>
                        {/* 임시로 주소만 표기 */}
                        <TableCell>{data?.farmInfoResponse.farmAddress.address}</TableCell>
                        <TableCell>{data?.farmInfoResponse.introduction}</TableCell>
                        <TableCell>{data?.farmInfoResponse.produceTypes}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="product-description">상품 설명:</div>
              </div>
            </div>
          </div>
        </div>

        <div className="example2" ref={yReview}>
          여기부터 리뷰
          {/* 여기에 리뷰 작성하세요 */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
