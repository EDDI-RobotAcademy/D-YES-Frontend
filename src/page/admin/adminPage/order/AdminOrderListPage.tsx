import { useState, useEffect } from "react";
import { Select, MenuItem, TableCell, TableHead, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { changeOrderStatus, getOrderList } from "page/admin/api/AdminApi";
import { AdminOrderList } from "page/order/entity/AdminOrderList";
import { OrderDeliveryStatus } from "page/order/entity/OrderDeliveryStatus";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import "./css/OrderListPage.css";
dayjs.extend(timezone);
dayjs.extend(utc);

// Asia/Seoul 타임존으로 dayjs 설정
dayjs.tz.setDefault("Asia/Seoul");

const AdminOrderListPage = () => {
  const navigate = useNavigate();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
  const [orderList, setOrderList] = useState([] as AdminOrderList[]);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderDeliveryStatus>>({});
  const [selectedDate, setSelectedDate] = useState<Record<string, dayjs.Dayjs>>(() => {
    const savedDates: Record<string, string> = JSON.parse(
      localStorage.getItem("selectedDates") || "{}"
    );
    const result: Record<string, dayjs.Dayjs> = {};
    for (const key in savedDates) {
      result[key] = dayjs(savedDates[key]);
    }
    return result;
  });

  const orderStatusTypes = [
    { value: "SUCCESS_PAYMENT", label: "결제 완료" },
    { value: "CANCEL_PAYMENT", label: "전체 취소" },
    { value: "PART_CANCEL_PAYMENT", label: "부분 취소" },
  ];

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const fetchOrderList = async () => {
    try {
      const fetchedOrderList = await getOrderList();
      const sortedOrderList = fetchedOrderList.sort(
        (a: AdminOrderList, b: AdminOrderList) =>
          parseInt(b.orderDetailInfoResponse.productOrderId) -
          parseInt(a.orderDetailInfoResponse.productOrderId)
      );
      setOrderList(sortedOrderList);
    } catch (error) {
      console.log("주문 목록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const handleStatusChange = async (productOrderId: string, newStatus: OrderDeliveryStatus) => {
    try {
      const savedDates = JSON.parse(localStorage.getItem("selectedDates") || "{}");
      const prevDate = savedDates[productOrderId];
      const currentDate = selectedDate[productOrderId]?.toDate().toISOString();

      if (!currentDate) {
        toast.error("배송 날짜를 선택해주세요.");
        return;
      }

      setOrderStatuses((prevStatuses) => ({
        ...prevStatuses,
        [productOrderId]: newStatus,
      }));

      savedDates[productOrderId] = currentDate;
      localStorage.setItem("selectedDates", JSON.stringify(savedDates));

      const data = {
        productOrderId: productOrderId,
        deliveryStatus: newStatus.toString(),
        deliveryDate: currentDate || "",
        userToken: localStorage.getItem("userToken") || "",
      };

      console.log("배송일", data);
      await changeOrderStatus(data);
    } catch (error) {
      console.log("배송 상태 업데이트 실패", error);
    }
  };

  const handleOrderClick = (productOrderId: string) => {
    navigate(`/adminOrderListPage/orderReadPage/${productOrderId}`);
  };

  return (
    <div className="order-list-container">
      <Box
        display="flex"
        alignItems="left"
        flexDirection="column"
        minHeight="40vh"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        margin="0 auto" // 수평 가운데 정렬
      >
        <table
          style={{
            borderCollapse: "collapse",
            textAlign: "center",
            margin: "20px",
          }}
        >
          <TableHead>
            <TableRow style={{ backgroundColor: "#F8F9FA" }}>
              <TableCell
                style={{
                  width: "7%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                주문 번호
              </TableCell>
              <TableCell
                style={{
                  width: "7%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                사용자 ID
              </TableCell>
              <TableCell
                style={{
                  width: "30%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                주소
              </TableCell>
              <TableCell
                style={{
                  width: "7%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                연락처
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                배송상태
              </TableCell>
              <TableCell
                style={{
                  width: "10%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                주문 일자
              </TableCell>
              <TableCell
                style={{
                  width: "10%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                결제 금액
              </TableCell>
              <TableCell
                style={{
                  width: "8%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                주문 상태
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {orderList?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    fontFamily: "SUIT-Light",
                  }}
                >
                  주문 목록이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              orderList.map((order) => (
                <TableRow
                  key={order.orderDetailInfoResponse.productOrderId}
                  onClick={(e) => handleOrderClick(order.orderDetailInfoResponse.productOrderId)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {order.orderDetailInfoResponse.productOrderId}
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {order.orderUserInfo.userId}
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {order.orderUserInfo.address.address} {order.orderUserInfo.address.zipCode} (
                    {order.orderUserInfo.address.addressDetail})
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {order.orderUserInfo.contactNumber}
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div onClick={(e) => e.stopPropagation()}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                          <DatePicker
                            value={
                              selectedDate[order.orderDetailInfoResponse.productOrderId] || dayjs()
                            }
                            onChange={(date) =>
                              setSelectedDate((prevSelectedDate) => ({
                                ...prevSelectedDate,
                                [order.orderDetailInfoResponse.productOrderId]: date || dayjs(),
                              }))
                            }
                          />
                        </LocalizationProvider>
                      </div>
                      <Select
                        value={
                          orderStatuses[order.orderDetailInfoResponse.productOrderId] ||
                          order.orderDetailInfoResponse.deliveryStatus
                        }
                        onChange={(e) => {
                          const newStatus = e.target.value as OrderDeliveryStatus;
                          const currentStatus =
                            orderStatuses[order.orderDetailInfoResponse.productOrderId] ||
                            order.orderDetailInfoResponse.deliveryStatus;
                          const orderStatus = order.orderDetailInfoResponse.orderStatus;
                          if (currentStatus.toString() === "DELIVERED") {
                            toast.error("이미 배송 완료된 주문은 상태를 변경할 수 없습니다.");
                            return;
                          }
                          if (
                            currentStatus.toString() === "SHIPPING" &&
                            newStatus.toString() !== "DELIVERED"
                          ) {
                            toast.error(
                              "배송 중인 주문은 배송 상태를 '배송 완료'로만 변경할 수 있습니다."
                            );
                            return;
                          }
                          if (orderStatus.toString() === "CANCEL_PAYMENT") {
                            toast.error("취소된 주문건입니다.");
                            return;
                          }
                          handleStatusChange(
                            order.orderDetailInfoResponse.productOrderId,
                            newStatus
                          );
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        style={{ width: "200px" }}
                        autoWidth={false}
                      >
                        <MenuItem value="PREPARING">상품 준비 중</MenuItem>
                        <MenuItem value="SHIPPING">배송 중</MenuItem>
                        <MenuItem value="DELIVERED">배송 완료</MenuItem>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {order.orderDetailInfoResponse.orderedTime}
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {order.orderDetailInfoResponse.totalPrice}
                  </TableCell>
                  <TableCell
                    style={{
                      padding: "8px 16px",
                      textAlign: "center",
                      fontFamily: "SUIT-Light",
                    }}
                  >
                    {orderStatusTypes.find(
                      (item) => item.value === order.orderDetailInfoResponse.orderStatus
                    )?.label || order.orderDetailInfoResponse.orderStatus}
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminOrderListPage;
