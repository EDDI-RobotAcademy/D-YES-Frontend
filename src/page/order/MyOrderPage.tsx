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

  const goToReviewPage = (productId: number) => {
    navigate(`/review/list/${productId}`);
  };

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
            ※ 주문 후 7일 이상 경과한 상품은 환불 신청이 불가능합니다.
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
                      <TableRow>
                        <TableCell>주문일자</TableCell>
                        <TableCell>상품명</TableCell>
                        <TableCell>옵션정보</TableCell>
                        <TableCell>총 상품금액</TableCell>
                        <TableCell>배송상태</TableCell>
                        <TableCell>리뷰</TableCell>
                        <TableCell>환불</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrderList.map((item: UserOrderList) =>
                        item.orderProductList.map(
                          (options: OrderProductListResponse, idx: number) => (
                            <TableRow key={idx}>
                              {idx === 0 ? (
                                <TableCell rowSpan={item.orderProductList.length}>
                                  {item.orderDetailInfoResponse.orderedTime}
                                </TableCell>
                              ) : null}
                              <TableCell>{options.productName}</TableCell>
                              <TableCell>
                                {options.orderOptionList.map(
                                  (option: OrderOptionListResponse, idx: number) => (
                                    <div key={idx}>
                                      {option.optionName}&nbsp;{option.optionCount}개
                                    </div>
                                  )
                                )}
                              </TableCell>
                              {idx === 0 ? (
                                <TableCell rowSpan={item.orderProductList.length}>
                                  {won(item.orderDetailInfoResponse.totalPrice || 0)}
                                </TableCell>
                              ) : null}
                              {idx === 0 ? (
                                <TableCell
                                  rowSpan={item.orderProductList.length}
                                  // className={`${
                                  //   tagMapping[item.orderDetailInfoResponse.deliveryStatus]?.className
                                  // }`}
                                >
                                  {tagMapping[item.orderDetailInfoResponse.deliveryStatus].name}
                                </TableCell>
                              ) : null}
                              {idx === 0 ? (
                                <TableCell rowSpan={item.orderProductList.length}>
                                  <Button
                                    variant="outlined"
                                    onClick={() => goToReviewPage(options.productId)}
                                    disabled={
                                      item.orderDetailInfoResponse.deliveryStatus !== "DELIVERED"
                                    }
                                  >
                                    리뷰 작성하기
                                  </Button>
                                </TableCell>
                              ) : null}
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  disabled={refundDeadline.some(
                                    (refundItem: UserOrderList) =>
                                      refundItem.orderDetailInfoResponse.productOrderId ===
                                      item.orderDetailInfoResponse.productOrderId
                                  )}
                                >
                                  환불 신청
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
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
