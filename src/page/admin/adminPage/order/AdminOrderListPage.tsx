import { TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getOrderList } from "page/admin/api/AdminApi";
import { AdminOrderList } from "page/order/entity/AdminOrderList";
import React, { useEffect, useState } from "react";

const AdminOrderListPage = () => {
  const [orderList, setOrderList] = useState([] as AdminOrderList[]);

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

  return (
    <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
      {/* <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        minHeight="50vh"
        paddingTop="32px"
        paddingBottom="20px"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        border="solid 1px lightgray"
        maxWidth="1200px" // 가로 길이 제한
        margin="0 auto" // 수평 가운데 정렬
      > */}
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
                  // width: "300px",
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
                  // width: "300px",
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
                  // width: "300px",
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
                  // width: "300px",
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
                  // width: "300px",
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
                  // width: "300px",
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
                  {order.orderDetailInfoResponse.deliveryStatus}
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
      {/* </Box> */}
    </div>
  );
};

export default AdminOrderListPage;
