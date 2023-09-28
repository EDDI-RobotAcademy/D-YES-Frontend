import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Slider,
} from "@mui/material";
import { CardActionArea } from "@mui/material";
import { getEventProductDetail, getEventProductList } from "./api/EventApi";
import { won } from "utility/filters/wonFilter";
import { getImageUrl } from "utility/s3/awsS3";
import "./css/EventProductListPage.css";
import { styled } from "@mui/material/styles";
import useEventReadStore from "./store/EventReadStore";
import { useNavigate } from "react-router-dom";
import { EventRead } from "./entity/EventRead";
import { EventProductListResponse } from "./entity/EventProductListResponse";

const EventListPage = () => {
  const navigate = useNavigate();
  const { setEventRead } = useEventReadStore();
  const [loading, setLoading] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState<
    EventProductListResponse[]
  >([]);
  const [loadedMainProduct, setLoadedMainProduct] =
    useState<EventProductListResponse>();

  const deadline = loadedMainProduct?.deadLineResponse.deadLine;
  let remainingDays = null;
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  const productsWithRemainingDays = loadedProducts.map((product) => {
    const deadline = product.deadLineResponse.deadLine;
    let remainingDays = null;

    if (deadline) {
      const deadlineDate = new Date(deadline);
      const currentDate = new Date();
      const timeDifference = deadlineDate.getTime() - currentDate.getTime();
      remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    }

    return {
      ...product,
      remainingDays,
    };
  });

  const calculatePercentage = loadedProducts.map((product) => {
    const nowCount = product.countResponse.nowCount;
    const targetCount = product.countResponse.targetCount;
    let percentage = 0;

    if (nowCount) {
      percentage = ((targetCount - nowCount) / targetCount) * 100;
    }

    return {
      percentage,
    };
  });

  const nowCount1 = loadedMainProduct?.countResponse.nowCount;
  const targetCount1 = loadedMainProduct?.countResponse.targetCount;
  let percentage = 0;

  if (nowCount1) {
    console.log("현재 모인수 : " + nowCount1);
    console.log("모집 인원 : " + targetCount1);
    percentage = (nowCount1 / (targetCount1 || 1)) * 100;
    console.log("달성율 : " + percentage);
    percentage = Math.floor(percentage);
  }

  const minOptionPrice =
    loadedMainProduct?.productOptionResponseForListForUser.minOptionPrice ?? 0;

  let discountedCurrentPrice = 0;
  let discountPercentage = 0;

  if (
    nowCount1 !== undefined &&
    targetCount1 !== undefined &&
    targetCount1 !== 0
  ) {
    discountedCurrentPrice =
      minOptionPrice -
      (minOptionPrice * (3 / 10) * (nowCount1 / targetCount1) || 0);
    discountPercentage =
      ((minOptionPrice - discountedCurrentPrice) / minOptionPrice) * 100;
  }

  const marks = [
    {
      value: 100,
      label: loadedMainProduct?.countResponse.targetCount + "명",
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
      color: "white",
      marginLeft: "-15px",
    },
  });

  // const options = [
  //   { value: "PESTICIDE_FREE", label: "무농약" },
  //   { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
  //   { value: "ORGANIC", label: "유기농" },
  // ];

  // const matchedOption = options.find(
  //   (option) => option.value === loadedMainProduct?.productResponseForListForUser.cultivationMethod
  // );

  const handleProductDetail = async (eventProductId: string) => {
    try {
      const eventData = await getEventProductDetail(eventProductId);
      if (eventData !== null) {
        setEventRead(eventData as unknown as EventRead);
      }
      navigate(`/eventProductDetail/${eventProductId}`);
    } catch (error) {
      console.error(
        "상세 페이지 이벤트 데이터를 불러오는 중 오류 발생:",
        error
      );
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getEventProductList();
        const responseListLength = response.responseList.length;
        const randomIndex = Math.floor(Math.random() * responseListLength);

        setLoadedProducts(response.responseList);
        setLoadedMainProduct(response.responseList[randomIndex]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="event-product-randon-list-container">
      <div className="event-product-randon-list-header">함께하면 저렴해요</div>
      <div className="event-product-container">
        <div className="event-product-introduce-container">
          {loading ? (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
              alignItems="center"
            ></Box>
          ) : (
            <Container
              sx={{
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                backgroundColor: "#252525",
              }}
            >
              <Box
                flexWrap="wrap"
                gap={2}
                justifyContent="center"
                alignItems="center"
                paddingTop="10px"
              >
                <Card
                  key={
                    loadedMainProduct?.productResponseForListForUser.productId
                  }
                  className=""
                  sx={{
                    width: "auto",
                    height: "auto",
                    marginBottom: 2,
                    boxShadow: "none",
                    position: "relative",
                    backgroundColor: "#252525",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ padding: "8px" }}>
                    <Typography
                      data-testid="event-product-name"
                      variant="h5"
                      fontFamily={"SUIT-Bold"}
                      color={"white"}
                    >
                      {
                        loadedMainProduct?.productResponseForListForUser
                          .productName
                      }
                    </Typography>
                    <Typography
                      data-testid="event-option-price"
                      variant="body2"
                      color={"white"}
                      fontFamily={"SUIT-ExtraBold"}
                      fontSize={"18px"}
                    >
                      <span className="discount-percentage-value">
                        {Math.floor(discountPercentage)}%
                      </span>
                      {discountedCurrentPrice !==
                      loadedMainProduct?.productOptionResponseForListForUser
                        .minOptionPrice ? (
                        <del>
                          <span className="original-price">
                            {won(
                              loadedMainProduct
                                ?.productOptionResponseForListForUser
                                .minOptionPrice || 0
                            )}
                          </span>
                        </del>
                      ) : (
                        <span>
                          {won(
                            loadedMainProduct
                              ?.productOptionResponseForListForUser
                              .minOptionPrice || 0
                          )}
                        </span>
                      )}

                      <span className="discounted-current-price-value">
                        {discountedCurrentPrice !==
                          loadedMainProduct?.productOptionResponseForListForUser
                            .minOptionPrice &&
                          won(Math.floor(discountedCurrentPrice))}
                      </span>
                    </Typography>
                    <PrettoSlider
                      valueLabelDisplay="auto"
                      aria-label="pretto slider"
                      defaultValue={percentage}
                      marks={marks}
                      disabled={true}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "20px",
                      }}
                    >
                      <Typography
                        data-testid="event-option-price"
                        variant="body2"
                        color={"white"}
                        fontFamily={"SUIT-Light"}
                      >
                        {remainingDays !== null
                          ? `남은 기간 : ${remainingDays}일`
                          : "남은 기간을 계산할 수 없습니다."}
                      </Typography>
                      <Typography
                        data-testid="event-option-price"
                        variant="body2"
                        color={"lightgray"}
                        fontFamily={"SUIT-Light"}
                        style={{ letterSpacing: "-0.5px" }}
                      >
                        {loadedMainProduct?.deadLineResponse.startLine.toString()}
                        ~
                        {loadedMainProduct?.deadLineResponse.deadLine.toString()}
                      </Typography>
                    </div>
                  </CardContent>
                  <CardContent
                    sx={{
                      padding: "8px",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography
                        data-testid="event-option-price"
                        variant="h6"
                        color={"#252525"}
                        fontFamily={"SUIT-Bold"}
                        fontSize={"16px"}
                        paddingLeft={"10px"}
                      >
                        {
                          loadedMainProduct?.farmInfoResponseForListForUser
                            .farmName
                        }
                        |
                        {
                          loadedMainProduct?.farmInfoResponseForListForUser
                            .representativeName
                        }
                      </Typography>
                      <Typography
                        data-testid="event-option-price"
                        variant="body2"
                        color={"#252525"}
                        fontFamily={"SUIT-Light"}
                        paddingLeft={"10px"}
                      >
                        {loadedMainProduct?.countResponse.nowCount}명이 함께하고
                        있어요!
                      </Typography>
                      <Typography
                        data-testid="event-option-price"
                        variant="body2"
                        color={"#252525"}
                        fontFamily={"SUIT-Light"}
                        paddingLeft={"10px"}
                        paddingTop={"10px"}
                      >
                        {/* <Chip
                          label={matchedOption ? matchedOption.label : ""}
                          color="success"
                          size="small"
                        /> */}
                      </Typography>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          display: "flex",
                          marginTop: "10px",
                          marginRight: "10px",
                        }}
                        image={getImageUrl(
                          loadedMainProduct?.farmInfoResponseForListForUser
                            .mainImage || ""
                        )}
                        alt={`mainImage ${loadedMainProduct?.farmInfoResponseForListForUser.mainImage}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Box>
            </Container>
          )}
        </div>
        <div className="event-product-info-container">
          {loading ? (
            <Box display="flex" flexWrap="wrap"></Box>
          ) : (
            <Container
              sx={{
                height: "auto",
              }}
            >
              <Box
                flexWrap="wrap"
                alignContent="center"
                justifyContent="center"
              >
                <CardMedia
                  component="img"
                  style={{
                    objectFit: "cover",
                    width: "400px",
                    height: "300px",
                  }}
                  image={getImageUrl(
                    loadedMainProduct?.productMainImageResponseForListForUser
                      .mainImg || ""
                  )}
                  alt={`mainImage ${loadedMainProduct?.productResponseForListForUser.productId}`}
                />
              </Box>
            </Container>
          )}
        </div>
      </div>
      <div className="event-product-other-container">
        <div className="event-product-other-list-header">전체 상품</div>
        {loading ? (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            justifyContent="center"
            alignItems="center"
          ></Box>
        ) : (
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
              alignItems="center"
              paddingTop="10px"
            >
              {loadedProducts.map((product, index) => (
                <Card
                  key={product.productResponseForListForUser.productId}
                  className=""
                  sx={{
                    width: 225,
                    height: "auto",
                    marginBottom: 2,
                    boxShadow: "none",
                    position: "relative",
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      handleProductDetail(
                        product.eventProductIdResponse?.eventProductId.toString() ||
                          ""
                      )
                    }
                  >
                    <CardContent
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "4px",
                        fontFamily: "SUIT-Light",
                        fontSize: "15px",
                      }}
                    ></CardContent>
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(
                        product.productMainImageResponseForListForUser.mainImg
                      )}
                      alt={`mainImage ${product.productResponseForListForUser.productId}`}
                    />
                    <CardContent
                      sx={{
                        padding: "8px",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div>
                        <Typography
                          data-testid="product-name"
                          variant="h6"
                          fontFamily={"SUIT-Bold"}
                        >
                          {product.productResponseForListForUser.productName}
                        </Typography>
                        <Typography
                          data-testid="option-price"
                          variant="body2"
                          color="text.secondary"
                          fontFamily={"SUIT-Light"}
                        >
                          {won(
                            product.productOptionResponseForListForUser
                              .minOptionPrice
                          )}
                        </Typography>
                        <Typography
                          data-testid="event-option-price"
                          variant="body2"
                          color="text.secondary"
                          fontFamily={"SUIT-Light"}
                        >
                          {productsWithRemainingDays[index].remainingDays !==
                          null
                            ? `남은 기간: ${productsWithRemainingDays[index].remainingDays}일`
                            : "남은 기간을 계산할 수 없습니다."}
                        </Typography>
                      </div>
                      <div
                        style={{
                          marginTop: "auto",
                          marginRight: "0px",
                          marginLeft: "auto",
                        }}
                      >
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap={2}
                          justifyContent="center"
                          alignItems="center"
                          // bgcolor={"red"}
                          border={"solid 1px"}
                          borderColor={"green"}
                          height={"50px"}
                          width={"50px"}
                          borderRadius={"50%"}
                        >
                          <Typography
                            data-testid="event-option-price"
                            variant="body2"
                            color="green"
                            fontFamily={"SUIT-ExtraBold"}
                            fontSize={"12px"}
                          >
                            {Math.floor(
                              calculatePercentage[index].percentage
                            ) !== null
                              ? `${Math.floor(
                                  calculatePercentage[index].percentage
                                )}%`
                              : "달성율을 계산할 수 없습니다."}
                          </Typography>
                        </Box>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Container>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
