import React, { useEffect, useRef, useState } from "react";
import { won } from "utility/filters/wonFilter";
import { Button, FormControl, MenuItem, Slider } from "@mui/material";
import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "utility/s3/awsS3";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import ReviewListPage from "page/review/ReviewListPage";

import "./css/EventProductDetailPage.css";
import {
  getEventProductDetail,
  useEventProductDetailQuery,
} from "./api/EventApi";
import ProductCarousel from "page/product/carousel/ProductCarousel";

interface ImageObject {
  id: number;
  url: string;
}

interface RouteParams {
  eventProductId: string;
  [key: string]: string;
}

const EventProductDetailPage = () => {
  const navigate = useNavigate();
  const { eventProductId } = useParams<RouteParams>();
  const { data } = useEventProductDetailQuery(eventProductId || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchEventProductData = async () => {
      await getEventProductDetail(eventProductId || "");
      setIsLoading(true);
    };
    fetchEventProductData();
  }, [eventProductId]);

  const mainImage: ImageObject = {
    id: 0,
    url: getImageUrl(data?.mainImageResponseForUser?.mainImg || ""),
  };
  const detailImages: ImageObject[] =
    data?.detailImagesForUser?.map((detail, index) => ({
      id: index + 1,
      url: getImageUrl(detail.detailImgs.toString()),
    })) || [];

  const imageArray: ImageObject[] = [mainImage, ...detailImages].filter(
    (item) => item !== null
  ) as ImageObject[];

  const tagMapping: { [key: string]: { className: string; name: string } } = {
    ORGANIC: { className: "tag-organic", name: "유기농" },
    PESTICIDE_FREE: { className: "tag-pesticide-free", name: "무농약" },
    ENVIRONMENT_FRIENDLY: {
      className: "tag-environment-friendly",
      name: "친환경",
    },
  };
  const [optionQuantities, setOptionQuantities] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    updateTotalPrice();
  }, [optionQuantities]);

  const updateTotalPrice = () => {
    let totalPrice = 0;
    const optionId = data?.optionResponseForUser.optionId;
    if (optionId) {
      totalPrice +=
        (data?.optionResponseForUser.optionPrice || 0) *
        (optionQuantities[optionId] || 0);
    }
    setTotalPrice(totalPrice);
  };

  const handleDecreaseQuantity = (optionId: number) => {
    if (optionQuantities[optionId] > 1) {
      setOptionQuantities((prevQuantities) => ({
        ...prevQuantities,
        [optionId]: prevQuantities[optionId] - 1,
      }));
    }
  };

  const handleIncreaseQuantity = (optionId: number) => {
    setOptionQuantities((prevQuantities) => ({
      ...prevQuantities,
      [optionId]: (prevQuantities[optionId] || 0) + 1,
    }));
  };

  const yDetail = useRef<HTMLDivElement>(null);
  const yReview = useRef<HTMLDivElement>(null);
  const onMoveDetail = () => {
    yDetail.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onMoveReview = () => {
    yReview.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const parsedHTML = parse(
    data?.productResponseForUser.productDescription || ""
  );

  const orderSelectedProduct = () => {
    if (Object.keys(optionQuantities).length === 0) {
      toast.error("수량을 선택해주세요.");
      return;
    }

    let extractedKey = Object.keys(optionQuantities).map((key) =>
      parseInt(key, 10)
    );
    let extractedValue = Object.values(optionQuantities);
    const selectedOptionId = extractedKey;
    const selectedOptionCount = extractedValue;
    const orderTotalPrice = totalPrice;
    const orderDataFrom = "DETAIL";
    navigate("/order", {
      state: {
        selectedOptionId: selectedOptionId,
        selectedOptionCount: selectedOptionCount,
        orderTotalPrice: orderTotalPrice,
        orderDataFrom: orderDataFrom,
      },
    });
  };

  const deadline = data?.eventProductDeadLineResponse.deadLine;
  let remainingDays = null;
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  const marks = [
    {
      value: 100,
      label: data?.eventProductPurchaseCountResponse.targetCount + "명",
    },
  ];

  const PrettoSlider = styled(Slider)({
    color: "#52af77",
    height: 8,
    "& .MuiSlider-track": {
      border: "none",
    },
    "& .MuiSlider-thumb": {
      height: 18,
      width: 18,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: "50% 50% 50% 0",
      backgroundColor: "#52af77",
      transformOrigin: "bottom left",
      transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
      "&:before": { display: "none" },
      "&.MuiSlider-valueLabelOpen": {
        transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
      },
      "& > *": {
        transform: "rotate(45deg)",
      },
    },
    "& .MuiSlider-markLabel": {
      color: "black",
      marginLeft: "-24px",
      marginTop: "-50px",
      fontSize: "20px",
      fontFamily: "SUIT-ExtraBold",
    },
  });

  const nowCount1 = data?.eventProductPurchaseCountResponse.nowCount;
  const targetCount1 = data?.eventProductPurchaseCountResponse.targetCount;
  let percentage = 0;

  if (nowCount1) {
    percentage = (nowCount1 / (targetCount1 || 1)) * 100;
    percentage = Math.floor(percentage);
  }

  return (
    <div className="event-product-detail-container">
      <div className="event-product-datail-main">
        <div className="event-product-info-grid">
          {data && isLoading ? (
            <>
              <div style={{ overflow: "hidden" }}>
                <div className="event-product-main-image">
                  <div className="event-product-details">
                    <ProductCarousel images={imageArray} />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="event-d-day">
                    <Chip
                      label={`D-${remainingDays}`}
                      color="error"
                      size="small"
                    />
                  </div>
                  <div className="event-product-name">
                    {data?.productResponseForUser.productName}
                  </div>
                  <div className="spacer-2" />
                  <div className="event-product-option-price">
                    {won(data?.optionResponseForUser.optionPrice)}
                  </div>
                  <div className="spacer-3" />
                  {data?.productResponseForUser.cultivationMethod &&
                    data?.productResponseForUser.cultivationMethod.length >
                      0 && (
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
                            tagMapping[
                              data?.productResponseForUser.cultivationMethod
                            ]?.className
                          } tag-common`}
                        >
                          {tagMapping[
                            data?.productResponseForUser.cultivationMethod
                          ]?.name ||
                            data?.productResponseForUser.cultivationMethod}
                        </div>
                      </div>
                    )}
                </div>
                <div className="event-slider">
                  <PrettoSlider
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    defaultValue={percentage}
                    marks={marks}
                    disabled={true}
                  />
                </div>
                <FormControl fullWidth>
                  <div className="choose-option">수량을 선택해주세요</div>
                  <MenuItem>
                    <div className="event-options-style">
                      {data.optionResponseForUser.optionName +
                        " / " +
                        data.optionResponseForUser.value +
                        data.optionResponseForUser.unit}
                      <span>{won(data.optionResponseForUser.optionPrice)}</span>
                    </div>
                    <div className="event-selected-option-count">
                      <div className="event-product-counter-button">
                        <div
                          className="event-product-button"
                          onClick={() =>
                            handleDecreaseQuantity(
                              data?.optionResponseForUser.optionId
                            )
                          }
                        >
                          <RemoveIcon />
                        </div>
                        <span className="event-product-counter">
                          {optionQuantities[
                            data?.optionResponseForUser.optionId
                          ] || 0}
                        </span>
                        <div
                          className="event-product-button"
                          onClick={() =>
                            handleIncreaseQuantity(
                              data?.optionResponseForUser.optionId
                            )
                          }
                        >
                          <AddIcon />
                        </div>
                      </div>
                    </div>
                  </MenuItem>
                </FormControl>
                <div className="spacer-3" />
                <div className="event-product-quantity">
                  총 상품 가격
                  <span className="event-product-price-sum">
                    <div className="event-price-sum">{won(totalPrice)}</div>
                  </span>
                </div>
                <div className="spacer-1" />
                <div className="event-farm-details">
                  <hr className="hr2-style" />
                  <div className="event-farm-profile-container">
                    <div className="event-farm-profile">
                      <img
                        src={getImageUrl(
                          data?.farmInfoResponseForUser.mainImage
                        )}
                        width={60}
                        height={60}
                        style={{
                          paddingTop: "14px",
                          paddingBottom: "8px",
                          borderRadius: "50%",
                        }}
                        alt="사진"
                      />
                    </div>
                    <div className="event-farm-introduce">
                      <span>{data?.farmInfoResponseForUser.farmName}</span>
                    </div>
                    <div className="event-farm-introduce">
                      <span>{data?.farmInfoResponseForUser.introduction}</span>
                    </div>
                  </div>
                </div>
                <hr className="hr2-style" />
                <div>
                  <Button
                    style={{ fontFamily: "SUIT-Bold", fontSize: "large" }}
                    className="event-confirm-button"
                    variant="contained"
                    onClick={orderSelectedProduct}
                  >
                    구매하기
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p>로딩중</p>
          )}
        </div>

        <div className="event-product-detail-container">
          <div className="event-sticky-header-container">
            <div className="event-sticky-header">
              <div className="event-sticky-header-elements">
                <div className="event-sticky-header-nav">
                  <div
                    className="event-sticky-header-button"
                    onClick={onMoveDetail}
                  >
                    상세 정보
                  </div>
                  <div
                    className="event-sticky-header-button"
                    onClick={onMoveReview}
                  >
                    리뷰
                  </div>
                </div>
                <div className="event-sticky-header-options"></div>
              </div>
            </div>
          </div>

          <div className="event-example1" ref={yDetail}>
            <div className="event-example-container">
              {data && isLoading ? (
                <>
                  <div>
                    <div className="event-product-description-container">
                      <div className="event-product-detail-header-name">
                        상품정보
                      </div>
                      <div>{parsedHTML}</div>
                    </div>
                  </div>
                </>
              ) : (
                <p>상품 상세 정보 불러오는 중</p>
              )}
            </div>
            <hr className="hr2-style" />
          </div>

          <div className="event-example2" ref={yReview}>
            {data && isLoading ? (
              <ReviewListPage reviewData={data?.productReviewResponseForUser} />
            ) : (
              <p>리뷰 정보 불러오는 중</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventProductDetailPage;
