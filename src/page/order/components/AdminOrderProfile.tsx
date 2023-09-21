import React from "react";
import { useOrderProfileDataStore } from "../store/OrderProfileStore";
import { Box, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const AdminOrderProfile = () => {
  const { orderProfileData } = useOrderProfileDataStore();
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
              주문자 정보
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
                수령인
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
                연락처
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
                이메일
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
                배송지
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            <TableRow>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {orderProfileData.orderedPurchaseName}
              </TableCell>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {orderProfileData.orderedPurchaseContactNumber}
              </TableCell>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {orderProfileData.orderedPurchaseEmail}
              </TableCell>
              <TableCell
                style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
              >
                {orderProfileData.address} {orderProfileData.zipCode} (
                {orderProfileData.addressDetail})
              </TableCell>
            </TableRow>
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminOrderProfile;
