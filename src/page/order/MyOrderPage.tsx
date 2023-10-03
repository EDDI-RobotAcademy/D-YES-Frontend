import React, { useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getUserOrderList } from "./api/OrderApi";
import { toast } from "react-toastify";
import { won } from "utility/filters/wonFilter";
import { UserOrderList } from "./entity/UserOrderList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import { OrderProductListResponse } from "./entity/UserOrderProduct";
import { OrderOptionListResponse } from "./entity/UserOrderOption";

import "./css/MyOrderPage.css";

const MyOrderPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadedOrderList, setLoadedOrderList] = React.useState<UserOrderList[]>([]);
  const [filter, setFilter] = React.useState<string>("today");
  const [filteredOrderList, setFilteredOrderList] = React.useState<UserOrderList[]>([]);
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();

  const currentDate = new Date();
  const koreanTime = 9 * 60 * 60 * 1000;
  const msKoreanTime = currentDate.getTime() + koreanTime;

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

  useEffect(() => {
    const fetchOrderData = async (): Promise<void> => {
      try {
        const data = await getUserOrderList();
        setLoadedOrderList(data);
        setIsLoading(true);
      } catch (error) {
        toast.error("주문 정보를 가져오는데 실패했습니다");
      }
    };
    fetchOrderData();
  }, []);

  useEffect(() => {
    const dateFilters: Record<string, number> = {
      today: 1,
      day7: 7,
      day15: 15,
      day30: 30,
      day90: 90,
      day365: 365,
    };
    if (isLoading) {
      const filteredOrders: UserOrderList[] = loadedOrderList.filter((item) => {
        const orderedTime: Date = new Date(item.orderDetailInfoResponse.orderedTime);
        // console.log("msKoreanTime", msKoreanTime);
        // console.log("orderedTime", orderedTime.getTime());
        const timeDifference: number = msKoreanTime - orderedTime.getTime();
        const daysAgo: number = timeDifference / (24 * 60 * 60 * 1000);
        return daysAgo <= dateFilters[filter];
      });
      setFilteredOrderList(filteredOrders);
    }
  }, [filter, isLoading, loadedOrderList]);

  const tagMapping: { [key: string]: { className: string; name: string } } = {
    PREPARING: { className: "order-state-preparing", name: "상품 준비 중" },
    SHIPPING: { className: "order-state-shipping", name: "배송 중" },
    DELIVERED: { className: "order-state-delivered", name: "배송 완료" },
  };

  const refundDeadline = React.useMemo(() => {
    return loadedOrderList.filter((item: UserOrderList) => {
      const orderedTime: Date = new Date(item.orderDetailInfoResponse.orderedTime);
      const timeDifference: number = msKoreanTime - orderedTime.getTime();
      const daysDifference: number = timeDifference / (24 * 60 * 60 * 1000);
      return daysDifference > 7;
    });
  }, [loadedOrderList]);

  const timeFilters: { label: string; value: string }[] = [
    { label: "오늘", value: "today" },
    { label: "7일", value: "day7" },
    { label: "15일", value: "day15" },
    { label: "1개월", value: "day30" },
    { label: "3개월", value: "day90" },
    { label: "1년", value: "day365" },
  ];

  const handleFilterClick = (value: string) => {
    setFilter(value);
  };

  const goToReviewPage = (productOrderId: string, options: OrderProductListResponse[]) => {
    const productOptionIdList: number[] = options.flatMap((option) =>
      option.orderOptionList.map((item) => item.optionId)
    );
    const productName: string = options[0].productName;
    const optionInfoList: OrderOptionListResponse[] = options.flatMap((option) =>
      option.orderOptionList.map((item) => item)
    );
    const filteredOptionInfo = optionInfoList.filter(
      (option) => option.orderProductStatus === "PURCHASED"
    );
    navigate("/review/register", {
      state: {
        productOptionId: productOptionIdList,
        orderId: productOrderId,
        productName: productName,
        optionInfo: filteredOptionInfo,
      },
    });
  };

  const goToRefund = (options: OrderProductListResponse[], orderId: string, optionId: number) => {
    const productName: string = options[0].productName;
    const optionInfo: OrderOptionListResponse[] = options.flatMap((option) =>
      option.orderOptionList.map((item) => item)
    );
    navigate("/payment/refund", {
      state: {
        orderId: orderId,
        productName: productName,
        optionInfo: optionInfo,
        optionId: [optionId],
      },
    });
  };

  const goToRefundWaiting = (
    options: OrderProductListResponse[],
    orderId: string,
    optionId: number
  ) => {
    const productName: string = options[0].productName;
    const optionInfo: OrderOptionListResponse[] = options.flatMap((option) =>
      option.orderOptionList.map((item) => item)
    );
    navigate("/payment/waiting-for-refund", {
      state: {
        orderId: orderId,
        productName: productName,
        optionInfo: optionInfo,
        optionId: [optionId],
      },
    });
  };

  return (
    <div className="ordered-container">
      <div className="ordered-grid">
        <div className="ordered-page-name">
          <p className="ordered-component-name">주문 목록/배송 조회</p>
        </div>
        <hr />
        <div className="ordered-check-controller">
          <div className="ordered-check-buttons">
            <span className="ordered-check-buttons-name">조회기간</span>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              {timeFilters.map((filterItem: { label: string; value: string }, idx: number) => (
                <Button
                  key={idx}
                  className="ordered-button-group-style"
                  onClick={() => handleFilterClick(filterItem.value)}
                  variant={filter === filterItem.value ? "contained" : "outlined"}
                >
                  {filterItem.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div className="ordered-notice">
            ※ 상품이 준비 중인 상태에는 주문을 취소할 수 있습니다.
            <br />※ 주문 후 7일 이상 경과한 상품은 환불 신청이 불가능합니다.
          </div>
        </div>
        {isLoading ? (
          <div>
            <div className="ordered-list">
              <div className="ordered-component">
                주문목록/배송조회 내역 총&nbsp;
                {filteredOrderList.length ? filteredOrderList.length : null}건
              </div>
              <div>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        style={{
                          borderTop: "2px solid",
                          borderBottom: "2px solid",
                        }}
                      >
                        <TableCell align="center">주문일자</TableCell>
                        <TableCell align="center">상품명</TableCell>
                        <TableCell align="center">옵션정보</TableCell>
                        <TableCell align="center">총 상품금액</TableCell>
                        <TableCell align="center">배송상태</TableCell>
                        <TableCell align="center">리뷰</TableCell>
                        <TableCell align="center">주문취소 및 환불</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrderList.map((item: UserOrderList, index: number) => {
                        const orderedTimes = new Set();
                        const productNames = new Set();
                        return item.orderProductList.map(
                          (options: OrderProductListResponse, idx: number) => {
                            const uniqueKey = `${index}${idx}`;
                            const isProductNameRowSpan = !productNames.has(options.productName);
                            if (isProductNameRowSpan) {
                              productNames.add(options.productName);
                            }
                            const isOrderedTimeRowSpan = !orderedTimes.has(
                              item.orderDetailInfoResponse.orderedTime
                            );
                            const formattedOrderedTime1 = isOrderedTimeRowSpan
                              ? new Date(item.orderDetailInfoResponse.orderedTime).toLocaleString(
                                  "ko-KR",
                                  {
                                    year: "2-digit",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )
                              : null;
                            const formattedOrderedTime2 = isOrderedTimeRowSpan
                              ? new Date(item.orderDetailInfoResponse.orderedTime).toLocaleString(
                                  "ko-KR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : null;
                            return (
                              <TableRow key={uniqueKey}>
                                {isProductNameRowSpan ? (
                                  <>
                                    {idx === 0 ? (
                                      <TableCell
                                        rowSpan={item.orderProductList.length}
                                        align="center"
                                      >
                                        {formattedOrderedTime1}
                                        <br />
                                        {formattedOrderedTime2}
                                      </TableCell>
                                    ) : null}
                                    <TableCell
                                      rowSpan={
                                        item.orderProductList.filter(
                                          (prod) => prod.productName === options.productName
                                        ).length
                                      }
                                      align="center"
                                    >
                                      {options.productName}
                                    </TableCell>
                                  </>
                                ) : null}
                                <TableCell align="center">
                                  {options.orderOptionList.map(
                                    (option: OrderOptionListResponse, idx: number) => (
                                      <div key={idx}>
                                        {option.optionName}&nbsp;{option.optionCount}개
                                        {idx !== options.orderOptionList.length - 1 ? <br /> : null}
                                      </div>
                                    )
                                  )}
                                </TableCell>
                                {idx === 0 ? (
                                  <>
                                    <TableCell rowSpan={item.orderProductList.length} align="right">
                                      {won(item.orderDetailInfoResponse.totalPrice || 0)}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      rowSpan={item.orderProductList.length}
                                    >
                                      {tagMapping[item.orderDetailInfoResponse.deliveryStatus].name}
                                    </TableCell>
                                  </>
                                ) : null}
                                {isProductNameRowSpan ? (
                                  <TableCell
                                    rowSpan={
                                      item.orderProductList.filter(
                                        (prod) => prod.productName === options.productName
                                      ).length
                                    }
                                    align="center"
                                  >
                                    {(() => {
                                      if (
                                        item.orderDetailInfoResponse.orderStatus ===
                                        "CANCEL_PAYMENT"
                                      ) {
                                        return <p>리뷰 작성 불가</p>;
                                      } else if (
                                        options.reviewId === null &&
                                        item.orderDetailInfoResponse.orderStatus !==
                                          "CANCEL_PAYMENT"
                                      ) {
                                        return (
                                          <Button
                                            variant="outlined"
                                            style={{
                                              color: "#578b36",
                                              borderColor: "#578b36",
                                            }}
                                            onClick={() =>
                                              goToReviewPage(
                                                item.orderDetailInfoResponse.productOrderId,
                                                item.orderProductList
                                              )
                                            }
                                          >
                                            리뷰 작성하기
                                          </Button>
                                        );
                                      } else {
                                        return <p>리뷰 작성 완료</p>;
                                      }
                                    })()}
                                  </TableCell>
                                ) : null}
                                {options.orderOptionList.flatMap((option) => (
                                  <TableCell align="center">
                                    {(() => {
                                      if (option.orderProductStatus === "PAYBACK") {
                                        return (
                                          <Button variant="contained" color="error" disabled>
                                            페이백 완료
                                          </Button>
                                        );
                                      }
                                      if (option.orderProductStatus === "REFUNDED") {
                                        return <p>환불 처리 완료</p>;
                                      }
                                      if (option.orderProductStatus === "WAITING_REFUND") {
                                        return <p>환불 신청 완료</p>;
                                      }
                                      if (option.orderProductStatus === "PURCHASED") {
                                        if (
                                          item.orderDetailInfoResponse.deliveryStatus ===
                                          "PREPARING"
                                        ) {
                                          return (
                                            <Button
                                              variant="contained"
                                              style={{
                                                backgroundColor: "#578b36",
                                                borderColor: "#578b36",
                                              }}
                                              color="error"
                                              onClick={() =>
                                                goToRefund(
                                                  item.orderProductList,
                                                  item.orderDetailInfoResponse.productOrderId,
                                                  option.optionId
                                                )
                                              }
                                            >
                                              주문 취소 신청
                                            </Button>
                                          );
                                        } else {
                                          return (
                                            <Button
                                              variant="contained"
                                              style={{
                                                backgroundColor: "#578b36",
                                                borderColor: "#578b36",
                                              }}
                                              color="error"
                                              disabled={refundDeadline.some(
                                                (refundItem: UserOrderList) =>
                                                  refundItem.orderDetailInfoResponse
                                                    .productOrderId ===
                                                  item.orderDetailInfoResponse.productOrderId
                                              )}
                                              onClick={() => {
                                                goToRefundWaiting(
                                                  item.orderProductList,
                                                  item.orderDetailInfoResponse.productOrderId,
                                                  option.optionId
                                                );
                                              }}
                                            >
                                              환불 신청
                                            </Button>
                                          );
                                        }
                                      }
                                    })()}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          }
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        ) : (
          <div>주문 목록 조회 중</div>
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;
