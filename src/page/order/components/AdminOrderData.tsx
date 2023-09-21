import { useOrderDataStore } from "../store/OrderDataStore";
import { Box, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const AdminOrderData = () => {
  const { orderData } = useOrderDataStore();

  const transformDeliveryStatus = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "상품 준비 중";
      case "SHIPPING":
        return "배송 중";
      case "DELIVERED":
        return "배송 완료";
      default:
        return status;
    }
  };

  const transformOrderStatus = (status: string) => {
    if (status === "SUCCESS_PAYMENT") {
      return "결제완료";
    } else {
      return status;
    }
  };

  const updatedOrderData = {
    ...orderData,
    deliveryStatus: transformDeliveryStatus(orderData.deliveryStatus),
  };

  updatedOrderData.orderStatus = transformOrderStatus(updatedOrderData.orderStatus);

  return (
    <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        // minHeight="130vh"
        paddingTop="32px"
        // paddingBottom="20px"
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
                PRODUCTORDERID
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
                배송상태
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
                결제상태
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            <TableRow>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {updatedOrderData.deliveryStatus}
              </TableCell>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {updatedOrderData.orderStatus}
              </TableCell>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {orderData.totalPrice}
              </TableCell>
            </TableRow>
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminOrderData;
