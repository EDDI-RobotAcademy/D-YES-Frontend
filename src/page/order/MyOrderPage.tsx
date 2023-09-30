import * as React from "react";
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
import { OrderProductListResponse } from "./entity/UserOrderProduct";
import { OrderOptionListResponse } from "./entity/UserOrderOption";

import "./css/MyOrderPage.css";

const MyOrderPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadedOrderList, setLoadedOrderList] = React.useState<UserOrderList[]>([]);
  const [filter, setFilter] = React.useState<string>("today");
  const [filteredOrderList, setFilteredOrderList] = React.useState<UserOrderList[]>([]);
  const navigate = useNavigate();

  const currentDate = new Date();
  const koreanTime = 9 * 60 * 60 * 1000;
  const msKoreanTime = currentDate.getTime() + koreanTime;

  React.useEffect(() => {
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

  React.useEffect(() => {
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
    const optionInfo: OrderOptionListResponse[] = options.flatMap((option) =>
      option.orderOptionList.map((item) => item)
    );
    navigate("/review/register", {
      state: {
        productOptionId: productOptionIdList,
        orderId: productOrderId,
        productName: productName,
        optionInfo: optionInfo,
      },
    });
  };

  const goToRefund = (options: OrderProductListResponse[], orderId: string) => {
    const productName: string = options[0].productName;
    const optionInfo: OrderOptionListResponse[] = options.flatMap((option) =>
      option.orderOptionList.map((item) => item)
    );
    navigate("/payment/refund", {
      state: {
        orderId: orderId,
        productName: productName,
        optionInfo: optionInfo,
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
              {timeFilters.map((filterItem: { label: string; value: string }) => (
                <Button
                  key={filterItem.value}
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
                      {filteredOrderList.map((item: UserOrderList) => {
                        const orderedTimes = new Set();
                        const productNames = new Set();
                        return item.orderProductList.map(
                          (options: OrderProductListResponse, idx: number) => {
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
                              <TableRow key={idx}>
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
                                  <>
                                    <TableCell
                                      rowSpan={
                                        item.orderProductList.filter(
                                          (prod) => prod.productName === options.productName
                                        ).length
                                      }
                                      align="center"
                                    >
                                      {options.reviewId === null ? (
                                        <Button
                                          variant="outlined"
                                          onClick={() =>
                                            goToReviewPage(
                                              item.orderDetailInfoResponse.productOrderId,
                                              item.orderProductList
                                            )
                                          }
                                          disabled={
                                            item.orderDetailInfoResponse.deliveryStatus !==
                                            "DELIVERED"
                                          }
                                        >
                                          리뷰 작성하기
                                        </Button>
                                      ) : (
                                        <>리뷰 작성 완료</>
                                      )}
                                    </TableCell>
                                    <TableCell
                                      rowSpan={
                                        item.orderProductList.filter(
                                          (prod) => prod.productName === options.productName
                                        ).length
                                      }
                                      align="center"
                                    >
                                      {item.orderDetailInfoResponse.deliveryStatus ===
                                      "PREPARING" ? (
                                        <Button
                                          variant="contained"
                                          color="error"
                                          onClick={() =>
                                            goToRefund(
                                              item.orderProductList,
                                              item.orderDetailInfoResponse.productOrderId
                                            )
                                          }
                                        >
                                          주문 취소
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="contained"
                                          color="error"
                                          disabled={refundDeadline.some(
                                            (refundItem: UserOrderList) =>
                                              refundItem.orderDetailInfoResponse.productOrderId ===
                                              item.orderDetailInfoResponse.productOrderId
                                          )}
                                        >
                                          환불 신청
                                        </Button>
                                      )}
                                    </TableCell>
                                  </>
                                ) : null}
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
