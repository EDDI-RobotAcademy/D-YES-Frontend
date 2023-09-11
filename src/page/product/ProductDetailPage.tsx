import React, { useEffect, useRef, useState } from "react";
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
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "utility/s3/awsS3";
import { toast } from "react-toastify";
import { sendCartContainRequest } from "page/cart/api/CartApi";
import Swal from "sweetalert2";
import parse from "html-react-parser";
import { getProductDetail, useProductDetailQuery } from "./api/ProductApi";
import ProductCarousel from "./carousel/ProductCarousel";
import { Cart } from "entity/cart/Cart";

import "./css/ProductDetailPage.css";

interface ImageObject {
  id: number;
  url: string;
}

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams<RouteParams>();
  const { data } = useProductDetailQuery(productId || "");
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await getProductDetail(productId || "");
      setIsLoading(true);
      if (data?.optionResponseForUser && data.optionResponseForUser.length > 0) {
        setSelectedOptionId(data.optionResponseForUser[0].optionId!);
      }
    };
    fetchProductData();
  }, []);

  const productResponse = data?.productResponseForUser;
  const productDescription = productResponse?.productDescription || "";
  const parsedHTML = parse(productDescription);

  const handleDecreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setProductQuantity(productQuantity + 1);
  };

  const addCart = async () => {
    const requestData: Cart = {
      productOptionId: selectedOption?.optionId!,
      optionCount: productQuantity,
    };
    try {
      await sendCartContainRequest(requestData);
      Swal.fire({
        title: "상품을 장바구니에 담았습니다",
        text: "장바구니에서 상품을 확인하실 수 있어요",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#aaaaaa",
        confirmButtonText: "장바구니로 이동",
        cancelButtonText: "계속해서 쇼핑하기",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/cart");
        }
      });
    } catch (error) {
      toast.error("장바구니 추가 실패");
    }
  };

  const mainImage: ImageObject = { id: 0, url: getImageUrl(data?.mainImageResponseForUser?.mainImg || "") };
  const detailImages: ImageObject[] =
    data?.detailImagesForUser?.map((detail, index) => ({
      id: index + 1,
      url: getImageUrl(detail.detailImgs),
    })) || [];
  const imageArray: ImageObject[] = [mainImage, ...detailImages].filter(
    (item) => item !== null
  ) as ImageObject[];

  const tagMapping: { [key: string]: { className: string; name: string } } = {
    ORGANIC: { className: "tag-organic", name: "유기농" },
    PESTICIDE_FREE: { className: "tag-pesticide-free", name: "무농약" },
    ENVIRONMENT_FRIENDLY: { className: "tag-environment-friendly", name: "친환경" },
  };

  const selectedOption =
    data && data.optionResponseForUser
      ? data.optionResponseForUser.find((option) => option.optionId === selectedOptionId)
      : null;

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
          {data && isLoading ? (
            <>
              <div style={{ overflow: "hidden" }}>
                <div className="product-main-image">
                  <div className="product-details">
                    <ProductCarousel images={imageArray} />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="product-name">{data?.productResponseForUser.productName}</div>
                  <div className="spacer-2" />
                  <div className="product-option-price">
                    {selectedOption ? won(selectedOption.optionPrice) : ""}
                  </div>
                  <div className="spacer-3" />
                  {data?.productResponseForUser.cultivationMethod &&
                    data?.productResponseForUser.cultivationMethod.length > 0 && (
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
                            tagMapping[data?.productResponseForUser.cultivationMethod]?.className
                          } tag-common`}
                        >
                          {tagMapping[data?.productResponseForUser.cultivationMethod]?.name ||
                            data?.productResponseForUser.cultivationMethod}
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
                    {data?.optionResponseForUser.map((option, idx) => (
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
                    onClick={addCart}
                  >
                    장바구니에 담기
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
            </>
          ) : (
            <p>로딩중</p>
          )}
        </div>

        <div className="product-detail-container">
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
              {data && isLoading ? (
                <>
                  <div>
                    <div className="product-description-container">
                      <div className="product-detail-header-name">상품정보</div>
                      <div>{parsedHTML}</div>
                    </div>
                    <hr className="hr2-style" />
                    {/* 여기에 상세 정보 작성하세요 */}
                    <div className="farm-details">
                      <div className="product-detail-header-name">판매자정보</div>

                      <div className="farm-profile-container">
                        <div className="farm-profile">
                          <img
                            src={getImageUrl(data?.farmInfoResponseForUser.mainImage)}
                            width={80}
                            height={80}
                            style={{
                              paddingTop: "14px",
                              paddingBottom: "8px",
                              borderRadius: "50%",
                            }}
                            alt="사진"
                          />
                          <div className="farm-name">
                            <span>{data?.farmInfoResponseForUser.farmName}</span>
                          </div>
                        </div>
                        <div className="farm-introduce">{data?.farmInfoResponseForUser.introduction}</div>
                      </div>

                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="farm-info table">
                          <TableHead style={{ backgroundColor: "#FAFAFA" }}>
                            <TableRow>
                              <TableCell
                                className="farm-info-cell"
                                style={{ width: "20%", textAlign: "center" }}
                              >
                                전화
                              </TableCell>
                              <TableCell
                                className="farm-info-cell"
                                style={{ width: "40%", textAlign: "center" }}
                              >
                                주소
                              </TableCell>
                              <TableCell
                                className="farm-info-cell"
                                style={{ width: "40%", textAlign: "center" }}
                              >
                                생산품목
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={data?.farmInfoResponseForUser.farmName}>
                              <TableCell
                                className="farm-info-cell"
                                style={{ width: "20%", textAlign: "center" }}
                              >
                                {data?.farmInfoResponseForUser.csContactNumber}
                              </TableCell>
                              {/* 임시로 주소만 표기 */}
                              <TableCell
                                className="farm-info-cell"
                                style={{ width: "40%", textAlign: "center" }}
                              >
                                {data?.farmInfoResponseForUser.farmAddress.address}
                              </TableCell>
                              <TableCell
                                className="farm-info-cell"
                                style={{ width: "40%", textAlign: "center" }}
                              >
                                {data?.farmInfoResponseForUser.produceTypes.map((produceType, index) => (
                                  <Chip
                                    size="small"
                                    style={{
                                      color: "#252525",
                                      backgroundColor: "#EEEEEE",
                                      marginLeft: "3px",
                                    }}
                                    key={index}
                                    label={
                                      produceType === "POTATO"
                                        ? "감자"
                                        : produceType === "SWEET_POTATO"
                                        ? "고구마"
                                        : produceType === "CABBAGE"
                                        ? "양배추"
                                        : produceType === "KIMCHI_CABBAGE"
                                        ? "배추"
                                        : produceType === "LEAF_LETTUCE"
                                        ? "양상추"
                                        : produceType === "ROMAINE_LETTUCE"
                                        ? "로메인 상추"
                                        : produceType === "PEPPER"
                                        ? "고추"
                                        : produceType === "GARLIC"
                                        ? "마늘"
                                        : produceType === "TOMATO"
                                        ? "토마토"
                                        : produceType === "CUCUMBER"
                                        ? "오이"
                                        : produceType === "CARROT"
                                        ? "당근"
                                        : produceType === "EGGPLANT"
                                        ? "가지"
                                        : produceType
                                    }
                                  />
                                ))}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </>
              ) : (
                <p>상품 상세 정보 불러오는 중</p>
              )}
            </div>
            <hr className="hr2-style" />
          </div>

          <div className="example2" ref={yReview}>
            {data && isLoading ? (
              <>
                {/* 여기에 리뷰 작성하세요 */}
                <div className="example-container">
                  <div className="product-detail-header-name">상품후기</div>
                </div>
              </>
            ) : (
              <p>리뷰 정보 불러오는 중</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
