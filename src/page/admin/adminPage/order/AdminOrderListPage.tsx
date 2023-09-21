import { useState, useEffect } from "react";
import { Select, MenuItem, TableCell, TableHead, TableRow, Typography } from "@mui/material";
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

dayjs.extend(timezone);
dayjs.extend(utc);

// Asia/Seoul 타임존으로 dayjs 설정
dayjs.tz.setDefault("Asia/Seoul");

const AdminOrderListPage = () => {
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

  const fetchOrderList = async () => {
    try {
      const fetchedOrderList = await getOrderList();
      setOrderList(fetchedOrderList);
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

      if (prevDate === currentDate) {
        toast.error("날짜가 변경되어야만 배송 상태를 변경할 수 있습니다.");
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

  return (
    <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        minHeight="130vh"
        paddingTop="32px"
        paddingBottom="20px"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        border="solid 1px lightgray"
        maxWidth="1600px" // 가로 길이 제한
        margin="0 auto" // 수평 가운데 정렬
      >
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              gutterBottom
              style={{
                fontSize: "20px",
                fontFamily: "SUIT-Medium",
                color: "#252525",
                marginTop: "20px",
              }}
            >
              주문 목록
            </Typography>
          </div>
        </div>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "center",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  width: "300px",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                USERID
              </TableCell>
              <TableCell
                style={{
                  width: "300px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                주소
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                연락처
              </TableCell>
              <TableCell
                style={{
                  width: "300px",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                배송상태
              </TableCell>
              <TableCell
                style={{
                  width: "100px",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                주문 시간
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                결제 금액
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {orderList?.map((order) => (
              <TableRow key={order.orderDetailInfoResponse.productOrderId}>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {order.orderUserInfo.userId}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {order.orderUserInfo.address.address} {order.orderUserInfo.address.zipCode} (
                  {order.orderUserInfo.address.addressDetail})
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {order.orderUserInfo.contactNumber}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
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

                        handleStatusChange(order.orderDetailInfoResponse.productOrderId, newStatus);
                      }}
                    >
                      <MenuItem value="PREPARING">상품 준비 중</MenuItem>
                      <MenuItem value="SHIPPING">배송 중</MenuItem>
                      <MenuItem value="DELIVERED">배송 완료</MenuItem>
                    </Select>
                  </div>
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {order.orderDetailInfoResponse.orderedTime}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {order.orderDetailInfoResponse.totalPrice}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminOrderListPage;
